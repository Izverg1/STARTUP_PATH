'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, 
  Building, 
  Mail, 
  Calendar, 
  Filter,
  Download,
  RefreshCw,
  Search
} from 'lucide-react'

interface WaitlistEntry {
  id: string
  email: string
  name: string | null
  company: string | null
  position: string | null
  type: 'customer' | 'partner'
  status: 'pending' | 'contacted' | 'converted' | 'declined' | 'spam'
  priority: number
  source: string
  additional_info: any
  created_at: string
  updated_at: string
}

interface WaitlistStats {
  type: string
  total_count: number
  pending_count: number
  contacted_count: number
  converted_count: number
  latest_signup: string
}

export default function WaitlistAdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [stats, setStats] = useState<WaitlistStats[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    search: ''
  })

  const fetchWaitlistData = async () => {
    setLoading(true)
    try {
      // Fetch entries
      const entriesResponse = await fetch('/api/admin/waitlist')
      if (entriesResponse.ok) {
        const entriesData = await entriesResponse.json()
        setEntries(entriesData.entries || [])
      }

      // Fetch stats
      const statsResponse = await fetch('/api/waitlist')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats || [])
      }
    } catch (error) {
      console.error('Error fetching waitlist data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWaitlistData()
  }, [])

  const updateEntryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Refresh data
        fetchWaitlistData()
      }
    } catch (error) {
      console.error('Error updating entry:', error)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesType = filter.type === 'all' || entry.type === filter.type
    const matchesStatus = filter.status === 'all' || entry.status === filter.status
    const matchesSearch = !filter.search || 
      entry.email.toLowerCase().includes(filter.search.toLowerCase()) ||
      entry.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
      entry.company?.toLowerCase().includes(filter.search.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      converted: 'bg-green-500/20 text-green-400 border-green-500/30',
      declined: 'bg-red-500/20 text-red-400 border-red-500/30',
      spam: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const getTypeBadge = (type: string) => {
    return type === 'customer' 
      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Waitlist Management</h1>
          <p className="text-gray-400">Manage customer and partner waitlist entries</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchWaitlistData}
            variant="outline"
            className="border-gray-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="border-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.type} className="bg-gray-900 border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.type === 'customer' ? 'bg-cyan-500/20' : 'bg-purple-500/20'}`}>
                {stat.type === 'customer' ? (
                  <Users className={`w-6 h-6 ${stat.type === 'customer' ? 'text-cyan-400' : 'text-purple-400'}`} />
                ) : (
                  <Building className="w-6 h-6 text-purple-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white capitalize">{stat.type}s</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Total: <span className="text-white font-bold">{stat.total_count}</span></p>
                    <p className="text-gray-400">Pending: <span className="text-yellow-400 font-bold">{stat.pending_count}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-400">Contacted: <span className="text-blue-400 font-bold">{stat.contacted_count}</span></p>
                    <p className="text-gray-400">Converted: <span className="text-green-400 font-bold">{stat.converted_count}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>
          
          <Select value={filter.type} onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by email, name, or company..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-80 bg-gray-800 border-gray-600"
            />
          </div>
        </div>
      </Card>

      {/* Entries Table */}
      <Card className="bg-gray-900 border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Waitlist Entries ({filteredEntries.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Contact</TableHead>
                <TableHead className="text-gray-400">Company</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Priority</TableHead>
                <TableHead className="text-gray-400">Joined</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Loading waitlist entries...
                  </TableCell>
                </TableRow>
              ) : filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{entry.name || 'No name'}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {entry.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white">{entry.company || 'No company'}</div>
                        {entry.position && (
                          <div className="text-sm text-gray-400">{entry.position}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(entry.type)}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(entry.status)}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-white">{entry.priority}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={entry.status}
                        onValueChange={(value) => updateEntryStatus(entry.id, value)}
                      >
                        <SelectTrigger className="w-28 bg-gray-800 border-gray-600 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}