'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Reply, 
  MoreHorizontal, 
  Pin, 
  Archive, 
  Trash2,
  Edit3,
  Check,
  X,
  Download,
  Eye,
  FileText,
  Image,
  Video,
  File,
  Tag,
  Clock,
  MessageCircle,
  Heart,
  ThumbsUp,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { 
  Thread, 
  Message, 
  User, 
  Attachment, 
  Mention, 
  Reaction,
  ThreadStatus,
  ThreadPriority 
} from '@/types';
import { formatDistanceToNow, format } from 'date-fns';

interface ThreadViewProps {
  thread: Thread;
  messages: Message[];
  currentUser: User;
  teamMembers: User[];
  onSendMessage: (content: string, mentions: Mention[], attachments: File[]) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (messageId: string, content: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  onUpdateThread: (updates: Partial<Thread>) => void;
  onArchiveThread: () => void;
  onDeleteThread: () => void;
}

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const statusColors = {
  active: 'bg-green-500',
  resolved: 'bg-blue-500',
  closed: 'bg-gray-500',
  archived: 'bg-gray-400'
};

const attachmentIcons = {
  image: Image,
  document: FileText,
  video: Video,
  audio: FileText,
  other: File
};

const commonEmojis = ['👍', '❤️', '😄', '🎉', '🚀', '👏', '🔥', '💯'];

export function ThreadView({
  thread,
  messages,
  currentUser,
  teamMembers,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReplyToMessage,
  onAddReaction,
  onRemoveReaction,
  onUpdateThread,
  onArchiveThread,
  onDeleteThread
}: ThreadViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentions, setMentions] = useState<Mention[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageChange = (value: string) => {
    setNewMessage(value);
    
    // Check for @mentions
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textUpToCursor = value.slice(0, cursorPos);
    const lastAtIndex = textUpToCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1 && lastAtIndex === textUpToCursor.length - 1) {
      setShowMentions(true);
      setMentionQuery('');
      setCursorPosition(cursorPos);
    } else if (lastAtIndex !== -1 && textUpToCursor.slice(lastAtIndex + 1).indexOf(' ') === -1) {
      const query = textUpToCursor.slice(lastAtIndex + 1);
      setMentionQuery(query);
      setShowMentions(true);
      setCursorPosition(cursorPos);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: User) => {
    const beforeCursor = newMessage.slice(0, cursorPosition - mentionQuery.length - 1);
    const afterCursor = newMessage.slice(cursorPosition);
    const newContent = `${beforeCursor}@${user.name} ${afterCursor}`;
    
    const mention: Mention = {
      user_id: user.id,
      user: { id: user.id, name: user.name, avatar_url: user.avatar_url },
      position: beforeCursor.length,
      length: user.name.length + 1
    };
    
    setMentions([...mentions, mention]);
    setNewMessage(newContent);
    setShowMentions(false);
    setMentionQuery('');
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPosition = beforeCursor.length + user.name.length + 2;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    
    onSendMessage(newMessage, mentions, attachments);
    setNewMessage('');
    setAttachments([]);
    setMentions([]);
    setReplyingToId(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const saveEdit = () => {
    if (editingMessageId && editingContent.trim()) {
      onEditMessage(editingMessageId, editingContent);
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = (attachment: Attachment) => {
    const IconComponent = attachmentIcons[attachment.type] || File;
    
    return (
      <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <IconComponent className="w-4 h-4" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => window.open(attachment.url, '_blank')}>
            <Eye className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => {
            const link = document.createElement('a');
            link.href = attachment.url;
            link.download = attachment.name;
            link.click();
          }}>
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.author_id === currentUser.id;
    const replyToMessage = message.reply_to_id ? 
      messages.find(m => m.id === message.reply_to_id) : null;

    return (
      <div key={message.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
        <Avatar className="w-8 h-8">
          <img
            src={message.author.avatar_url || `https://avatar.vercel.sh/${message.author.name}`}
            alt={message.author.name}
          />
        </Avatar>
        
        <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">{message.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.created_at), 'MMM d, HH:mm')}
            </span>
            {message.is_edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
          
          {replyToMessage && (
            <div className="mb-2 p-2 bg-muted/50 rounded border-l-2 border-primary">
              <div className="text-xs text-muted-foreground mb-1">
                Replying to {replyToMessage.author.name}
              </div>
              <div className="text-sm truncate">{replyToMessage.content}</div>
            </div>
          )}
          
          <div className={`p-3 rounded-lg ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}>
            {editingMessageId === message.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map(renderAttachment)}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    if (reaction.users.includes(currentUser.id)) {
                      onRemoveReaction(message.id, reaction.emoji);
                    } else {
                      onAddReaction(message.id, reaction.emoji);
                    }
                  }}
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            </div>
          )}
          
          {/* Message Actions */}
          {editingMessageId !== message.id && (
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Smile className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="grid grid-cols-4 gap-1">
                    {commonEmojis.map((emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onAddReaction(message.id, emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReplyingToId(message.id)}
              >
                <Reply className="w-3 h-3" />
              </Button>
              
              {isOwnMessage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEditing(message)}>
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDeleteMessage(message.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl">{thread.title}</CardTitle>
                {thread.is_pinned && <Pin className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${statusColors[thread.status]}`} />
                  {thread.status}
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${priorityColors[thread.priority]}`} />
                  {thread.priority} priority
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {thread.message_count} messages
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                </div>
              </div>
              {thread.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {thread.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={thread.status}
                onValueChange={(value) => onUpdateThread({ status: value as ThreadStatus })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={thread.priority}
                onValueChange={(value) => onUpdateThread({ priority: value as ThreadPriority })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onUpdateThread({ is_pinned: !thread.is_pinned })}>
                    <Pin className="w-4 h-4" />
                    {thread.is_pinned ? 'Unpin' : 'Pin'} Thread
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onArchiveThread}>
                    <Archive className="w-4 h-4" />
                    Archive Thread
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={onDeleteThread}>
                    <Trash2 className="w-4 h-4" />
                    Delete Thread
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 mb-4 overflow-y-hidden">
        <div className="space-y-6 p-4 group">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Context */}
      {replyingToId && (
        <div className="mb-4 p-3 bg-muted/50 rounded border-l-2 border-primary">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Replying to {messages.find(m => m.id === replyingToId)?.author.name}
            </div>
            <Button size="sm" variant="ghost" onClick={() => setReplyingToId(null)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {messages.find(m => m.id === replyingToId)?.content}
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="text-sm font-medium">Attachments ({attachments.length})</div>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <File className="w-4 h-4" />
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Button size="sm" variant="ghost" onClick={() => removeAttachment(index)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={replyingToId ? "Write a reply..." : "Type your message..."}
              value={newMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="min-h-[80px] resize-none pr-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            {/* Mentions Dropdown */}
            {showMentions && filteredMembers.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border rounded-lg shadow-lg h-48 overflow-y-hidden z-10">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    className="w-full flex items-center gap-2 p-2 hover:bg-muted text-left"
                    onClick={() => insertMention(member)}
                  >
                    <Avatar className="w-6 h-6">
                      <img
                        src={member.avatar_url || `https://avatar.vercel.sh/${member.email}`}
                        alt={member.name}
                      />
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4" />
                Attach
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0}
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}