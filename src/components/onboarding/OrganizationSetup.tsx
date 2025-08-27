'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Loader2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface OrganizationSetupProps {
  onOrganizationCreated: () => void;
}

export function OrganizationSetup({ onOrganizationCreated }: OrganizationSetupProps) {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) {
      setError('Organization name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('No authenticated user found');
      }

      // Create organization
      const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
      
      const { data: org, error: orgError } = await supabase
        .from('SPATH_organizations')
        .insert({
          name: orgName,
          slug: slug + '-' + Date.now(), // Add timestamp to avoid conflicts
          subscription_tier: 'demo',
          owner_id: user.id,
          settings: {
            demo_mode: true,
            features_enabled: ['simulation', 'benchmarks', 'collaboration']
          }
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Update user profile to link to this organization
      const { error: userError } = await supabase
        .from('SPATH_users')
        .upsert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!,
          org_id: org.id,
          role: 'owner',
          is_active: true
        });

      if (userError) throw userError;

      // Success! Call the callback to refresh the parent component
      onOrganizationCreated();
      
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDemo = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('No authenticated user found');
      }

      // Find the demo organization
      const { data: demoOrg, error: findError } = await supabase
        .from('SPATH_organizations')
        .select('id')
        .eq('slug', 'startup-path-demo')
        .single();

      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }

      let orgId: string;

      if (!demoOrg) {
        // Create demo organization if it doesn't exist
        const { data: newOrg, error: createError } = await supabase
          .from('SPATH_organizations')
          .insert({
            name: 'STARTUP_PATH Demo',
            slug: 'startup-path-demo',
            subscription_tier: 'demo',
            settings: {
              demo_mode: true,
              features_enabled: ['simulation', 'benchmarks', 'collaboration']
            }
          })
          .select('id')
          .single();

        if (createError) throw createError;
        orgId = newOrg.id;
      } else {
        orgId = demoOrg.id;
      }

      // Update user profile to link to demo organization
      const { error: userError } = await supabase
        .from('SPATH_users')
        .upsert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!,
          org_id: orgId,
          role: 'contributor',
          is_active: true
        });

      if (userError) throw userError;

      // Success! Call the callback to refresh the parent component
      onOrganizationCreated();
      
    } catch (err) {
      console.error('Error joining demo organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to join demo organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-96">
      <Card className="bg-slate-900/50 border-slate-700/50 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Building2 className="h-5 w-5 text-yellow-400" />
            Organization Setup
          </CardTitle>
          <p className="text-sm text-gray-400">
            Create or join an organization to get started with STARTUP_PATH
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleJoinDemo}
              disabled={loading}
              className="w-full bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-400"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              Join Demo Organization
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-gray-400">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
                className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400"
                disabled={loading}
              />
              <Button 
                onClick={handleCreateOrganization}
                disabled={loading || !orgName.trim()}
                variant="outline"
                className="w-full bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-800/70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create New Organization
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}