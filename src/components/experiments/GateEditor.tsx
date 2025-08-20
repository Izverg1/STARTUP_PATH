'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  metric: string;
  operator: 'gte' | 'lte';
  threshold_value: number;
  benchmark_value?: number;
  is_critical: boolean;
}

interface GateEditorProps {
  gates: Gate[];
  onGatesChange: (gates: Gate[]) => void;
  benchmarks: {
    [key: string]: {
      value: number;
      range: { min: number; max: number };
      unit: string;
    };
  };
}

export function GateEditor({ gates, onGatesChange, benchmarks }: GateEditorProps) {
  const [editingGate, setEditingGate] = useState<string | null>(null);
  const [newGate, setNewGate] = useState<Partial<Gate>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const updateGate = (gateId: string, updates: Partial<Gate>) => {
    const updated = gates.map(gate => 
      gate.id === gateId ? { ...gate, ...updates } : gate
    );
    onGatesChange(updated);
    setEditingGate(null);
  };

  const removeGate = (gateId: string) => {
    const updated = gates.filter(gate => gate.id !== gateId);
    onGatesChange(updated);
  };

  const addGate = () => {
    if (!newGate.name || !newGate.metric || newGate.threshold_value === undefined) {
      return;
    }

    const gate: Gate = {
      id: `gate_${Date.now()}`,
      name: newGate.name,
      metric: newGate.metric,
      operator: newGate.operator || 'gte',
      threshold_value: newGate.threshold_value,
      benchmark_value: newGate.benchmark_value,
      is_critical: newGate.is_critical || false
    };

    onGatesChange([...gates, gate]);
    setNewGate({});
    setShowAddForm(false);
  };

  const formatValue = (value: number, metric: string) => {
    const benchmark = benchmarks[metric];
    if (benchmark) {
      if (benchmark.unit === '%') {
        return `${(value * 100).toFixed(1)}%`;
      } else if (benchmark.unit === '$') {
        return `$${value.toFixed(0)}`;
      }
    }
    return value.toString();
  };

  const getGateStatus = (gate: Gate): 'pass' | 'warning' | 'fail' => {
    // Simulate current performance vs threshold
    const benchmark = gate.benchmark_value || 0;
    const variance = (Math.random() - 0.5) * 0.4; // ±20% variance
    const currentValue = benchmark * (1 + variance);
    
    if (gate.operator === 'gte') {
      if (currentValue >= gate.threshold_value) return 'pass';
      if (currentValue >= gate.threshold_value * 0.9) return 'warning';
      return 'fail';
    } else {
      if (currentValue <= gate.threshold_value) return 'pass';
      if (currentValue <= gate.threshold_value * 1.1) return 'warning';
      return 'fail';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBenchmarkComparison = (gate: Gate) => {
    if (!gate.benchmark_value) return null;
    
    const isAboveBenchmark = gate.operator === 'gte' ? 
      gate.threshold_value >= gate.benchmark_value :
      gate.threshold_value <= gate.benchmark_value;
    
    const difference = Math.abs(
      ((gate.threshold_value - gate.benchmark_value) / gate.benchmark_value) * 100
    );
    
    return {
      isAboveBenchmark,
      difference: difference.toFixed(0)
    };
  };

  return (
    <div className="space-y-4">
      {/* Existing Gates */}
      <div className="space-y-3">
        {gates.map((gate) => {
          const isEditing = editingGate === gate.id;
          const status = getGateStatus(gate);
          const benchmark = getBenchmarkComparison(gate);
          
          return (
            <div key={gate.id} className="border border-red-500/30 rounded-lg p-4 bg-white/5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`name_${gate.id}`} className="text-white">Gate Name</Label>
                        <Input
                          id={`name_${gate.id}`}
                          value={gate.name}
                          onChange={(e) => updateGate(gate.id, { name: e.target.value })}
                          className="bg-white/5 border-red-500/30 text-white placeholder:text-gray-400"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`threshold_${gate.id}`} className="text-white">Threshold Value</Label>
                          <Input
                            id={`threshold_${gate.id}`}
                            type="number"
                            step="any"
                            value={gate.threshold_value}
                            onChange={(e) => updateGate(gate.id, { 
                              threshold_value: parseFloat(e.target.value) || 0 
                            })}
                            className="bg-white/5 border-red-500/30 text-white placeholder:text-gray-400"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`operator_${gate.id}`} className="text-white">Operator</Label>
                          <select
                            id={`operator_${gate.id}`}
                            value={gate.operator}
                            onChange={(e) => updateGate(gate.id, { 
                              operator: e.target.value as 'gte' | 'lte' 
                            })}
                            className="w-full px-3 py-2 border border-red-500/30 rounded-md bg-white/5 text-white"
                          >
                            <option value="gte">Greater than or equal (≥)</option>
                            <option value="lte">Less than or equal (≤)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`critical_${gate.id}`}
                          checked={gate.is_critical}
                          onChange={(e) => updateGate(gate.id, { is_critical: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor={`critical_${gate.id}`} className="text-sm text-white">
                          Critical gate (failure triggers immediate review)
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => setEditingGate(null)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingGate(null)}
                          className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-white">{gate.name}</h4>
                        {gate.is_critical && (
                          <Badge variant="destructive" className="text-xs bg-red-900/20 text-red-300 border-red-500/30">
                            Critical
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs border-red-500/30 text-red-300">
                          {getStatusIcon(status)}
                          <span className="ml-1 capitalize">{status}</span>
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-300 mb-2">
                        <span className="font-medium">{gate.metric.replace('_', ' ')}</span>
                        <span className="mx-2">
                          {gate.operator === 'gte' ? '≥' : '≤'}
                        </span>
                        <span className="font-medium">
                          {formatValue(gate.threshold_value, gate.metric)}
                        </span>
                      </div>
                      
                      {gate.benchmark_value && benchmark && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Info className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-400">
                              Benchmark: {formatValue(gate.benchmark_value, gate.metric)}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 ${
                            benchmark.isAboveBenchmark ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {benchmark.isAboveBenchmark ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                              {benchmark.difference}% {benchmark.isAboveBenchmark ? 'above' : 'below'} benchmark
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {!isEditing && (
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGate(gate.id)}
                      className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGate(gate.id)}
                      className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Gate */}
      {showAddForm ? (
        <div className="border-2 border-dashed border-red-500/30 rounded-lg p-4 bg-red-900/10">
          <h4 className="font-medium mb-3 text-white">Add New Gate</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="new_gate_name" className="text-white">Gate Name</Label>
              <Input
                id="new_gate_name"
                value={newGate.name || ''}
                onChange={(e) => setNewGate({ ...newGate, name: e.target.value })}
                placeholder="e.g., Click-Through Rate"
                className="bg-white/5 border-red-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new_gate_metric" className="text-white">Metric</Label>
                <select
                  id="new_gate_metric"
                  value={newGate.metric || ''}
                  onChange={(e) => {
                    const metric = e.target.value;
                    const benchmark = benchmarks[metric];
                    setNewGate({ 
                      ...newGate, 
                      metric,
                      benchmark_value: benchmark?.value
                    });
                  }}
                  className="w-full px-3 py-2 border border-red-500/30 rounded-md bg-white/5 text-white"
                >
                  <option value="">Select metric...</option>
                  <option value="click_through_rate">Click-Through Rate</option>
                  <option value="conversion_rate">Conversion Rate</option>
                  <option value="cost_per_lead">Cost Per Lead</option>
                  <option value="cost_per_meeting">Cost Per Meeting</option>
                  <option value="reply_rate">Reply Rate</option>
                  <option value="open_rate">Open Rate</option>
                  <option value="meeting_book_rate">Meeting Book Rate</option>
                  <option value="attendance_rate">Attendance Rate</option>
                  <option value="engagement_rate">Engagement Rate</option>
                  <option value="organic_traffic">Organic Traffic</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="new_gate_operator" className="text-white">Operator</Label>
                <select
                  id="new_gate_operator"
                  value={newGate.operator || 'gte'}
                  onChange={(e) => setNewGate({ 
                    ...newGate, 
                    operator: e.target.value as 'gte' | 'lte' 
                  })}
                  className="w-full px-3 py-2 border border-red-500/30 rounded-md bg-white/5 text-white"
                >
                  <option value="gte">Greater than or equal (≥)</option>
                  <option value="lte">Less than or equal (≤)</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="new_gate_threshold" className="text-white">Threshold Value</Label>
              <Input
                id="new_gate_threshold"
                type="number"
                step="any"
                value={newGate.threshold_value || ''}
                onChange={(e) => setNewGate({ 
                  ...newGate, 
                  threshold_value: parseFloat(e.target.value) || 0 
                })}
                placeholder="Enter threshold value"
                className="bg-white/5 border-red-500/30 text-white placeholder:text-gray-400"
              />
              {newGate.metric && benchmarks[newGate.metric] && (
                <div className="text-xs text-gray-400 mt-1">
                  Industry benchmark: {formatValue(benchmarks[newGate.metric].value, newGate.metric)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="new_gate_critical"
                checked={newGate.is_critical || false}
                onChange={(e) => setNewGate({ ...newGate, is_critical: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="new_gate_critical" className="text-sm text-white">
                Critical gate (failure triggers immediate review)
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={addGate} 
                size="sm"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                Add Gate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewGate({});
                }}
                className="border-red-500/30 text-red-300 hover:bg-red-500/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full border-dashed border-red-500/30 text-red-300 hover:bg-red-500/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Gate
        </Button>
      )}

      {/* Gate Summary */}
      {gates.length > 0 && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="text-sm text-gray-300">
            <strong>{gates.length}</strong> gates configured
            {gates.some(g => g.is_critical) && (
              <span> • <strong>{gates.filter(g => g.is_critical).length}</strong> critical</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Critical gate failures will automatically pause the channel for review
          </div>
        </div>
      )}
    </div>
  );
}