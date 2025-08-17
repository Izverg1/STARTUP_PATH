'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Clock, 
  Target, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Play,
  BookOpen,
  Filter,
  Star,
  Users
} from 'lucide-react';
import { ScenarioTemplate, createScenarioGenerator } from '@/lib/simulation/scenario-generator';

interface ScenarioLibraryProps {
  onSelectScenario: (templateId: string) => void;
  selectedScenarioId?: string;
  className?: string;
}

export function ScenarioLibrary({
  onSelectScenario,
  selectedScenarioId,
  className = ''
}: ScenarioLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  const generator = createScenarioGenerator();
  const allTemplates = generator.getTemplates();

  // Filter templates based on search and filters
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryIcon = (category: ScenarioTemplate['category']) => {
    switch (category) {
      case 'startup': return <Lightbulb className="h-4 w-4" />;
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'scale': return <Users className="h-4 w-4" />;
      case 'optimization': return <Target className="h-4 w-4" />;
      case 'crisis': return <AlertTriangle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: ScenarioTemplate['category']) => {
    switch (category) {
      case 'startup': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growth': return 'bg-green-100 text-green-800 border-green-200';
      case 'scale': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'optimization': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: ScenarioTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ScenarioTemplate[]>);

  const ScenarioCard = ({ template }: { template: ScenarioTemplate }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedScenarioId === template.id ? 'ring-2 ring-primary shadow-md' : ''
      }`}
      onClick={() => onSelectScenario(template.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(template.category)}
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </div>
          {selectedScenarioId === template.id && (
            <Star className="h-5 w-5 text-primary fill-current" />
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className={getCategoryColor(template.category)}>
            {template.category}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
            {template.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{template.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{template.estimatedDuration} min</span>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Learning Objectives:</div>
          <ul className="text-xs space-y-1">
            {template.learningObjectives.slice(0, 2).map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{objective}</span>
              </li>
            ))}
            {template.learningObjectives.length > 2 && (
              <li className="text-muted-foreground">
                +{template.learningObjectives.length - 2} more...
              </li>
            )}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <Button 
          variant={selectedScenarioId === template.id ? "default" : "outline"}
          size="sm" 
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {selectedScenarioId === template.id ? 'Selected' : 'Select Scenario'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Scenario Library</h2>
            <p className="text-muted-foreground">
              Choose from pre-built scenarios to test your allocation strategies
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredTemplates.length} scenarios
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scenarios, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
              <SelectItem value="optimization">Optimization</SelectItem>
              <SelectItem value="crisis">Crisis</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scenario Display */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="startup">Startup</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="scale">Scale</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="crisis">Crisis</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {Object.keys(groupedTemplates).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No scenarios found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category as ScenarioTemplate['category'])}
                    <h3 className="text-xl font-semibold capitalize">{category}</h3>
                    <Badge variant="secondary">{templates.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                      <ScenarioCard key={template.id} template={template} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {(['startup', 'growth', 'scale', 'optimization', 'crisis'] as const).map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .filter(t => t.category === category)
                .map(template => (
                  <ScenarioCard key={template.id} template={template} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {allTemplates.filter(t => t.difficulty === 'beginner').length}
              </div>
              <div className="text-sm text-muted-foreground">Beginner</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {allTemplates.filter(t => t.difficulty === 'intermediate').length}
              </div>
              <div className="text-sm text-muted-foreground">Intermediate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {allTemplates.filter(t => t.difficulty === 'advanced').length}
              </div>
              <div className="text-sm text-muted-foreground">Advanced</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(allTemplates.reduce((sum, t) => sum + t.estimatedDuration, 0) / allTemplates.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}