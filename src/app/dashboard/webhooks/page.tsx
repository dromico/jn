"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Clipboard, Check } from 'lucide-react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  created_at: string;
  last_triggered?: string;
  last_status?: 'success' | 'error';
}

const availableEvents = [
  { value: 'invoice.created', label: 'Invoice Created' },
  { value: 'invoice.paid', label: 'Invoice Paid' },
  { value: 'quote.created', label: 'Quotation Created' },
  { value: 'quote.approved', label: 'Quotation Approved' },
  { value: 'todo.created', label: 'Task Created' },
  { value: 'todo.completed', label: 'Task Completed' },
];

// Mock data for demo purposes
const mockWebhooks: Webhook[] = [
  {
    id: '1',
    name: 'Make.com Invoice Integration',
    url: 'https://hook.make.com/abc123456789',
    events: ['invoice.created', 'invoice.paid'],
    active: true,
    secret: 'whsec_abc123456789',
    created_at: '2023-05-15T10:00:00Z',
    last_triggered: '2023-06-01T15:30:00Z',
    last_status: 'success',
  },
  {
    id: '2',
    name: 'Task Notifications',
    url: 'https://hook.make.com/def987654321',
    events: ['todo.created', 'todo.completed'],
    active: false,
    secret: 'whsec_def987654321',
    created_at: '2023-05-20T14:22:00Z',
  },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [testResponse, setTestResponse] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    // In a real app, fetch from Supabase
    // const fetchWebhooks = async () => {
    //   const { data, error } = await supabase
    //     .from('webhooks')
    //     .select('*')
    //     .order('created_at', { ascending: false });
    //   
    //   if (error) {
    //     console.error('Error fetching webhooks:', error);
    //     return;
    //   }
    //   
    //   if (data) {
    //     setWebhooks(data);
    //   }
    // };
    // 
    // fetchWebhooks();

    // For demo, use mock data
    setWebhooks(mockWebhooks);
  }, []);

  const handleCreateWebhook = () => {
    // Create a new webhook with default values
    const newWebhook: Webhook = {
      id: `temp_${Date.now()}`,
      name: '',
      url: '',
      events: [],
      active: false,
      secret: generateSecret(),
      created_at: new Date().toISOString(),
    };
    
    setSelectedWebhook(newWebhook);
    setTestResponse(null);
  };

  const handleSaveWebhook = async (webhook: Webhook) => {
    // Validate webhook data
    if (!webhook.name || !webhook.url || webhook.events.length === 0) {
      setTestResponse({
        success: false,
        message: 'Please fill in all required fields and select at least one event.',
      });
      return;
    }

    // In a real app, save to Supabase
    // const { data, error } = await supabase
    //   .from('webhooks')
    //   .upsert([webhook])
    //   .select();
    // 
    // if (error) {
    //   console.error('Error saving webhook:', error);
    //   setTestResponse({
    //     success: false,
    //     message: `Failed to save webhook: ${error.message}`,
    //   });
    //   return;
    // }

    // For demo, update local state
    let updatedWebhooks;
    if (webhook.id.startsWith('temp_')) {
      const newId = (webhooks.length + 1).toString();
      updatedWebhooks = [...webhooks, { ...webhook, id: newId }];
    } else {
      updatedWebhooks = webhooks.map((wh) =>
        wh.id === webhook.id ? webhook : wh
      );
    }
    
    setWebhooks(updatedWebhooks);
    setSelectedWebhook(null);
    setTestResponse({
      success: true,
      message: 'Webhook saved successfully.',
    });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setTestResponse(null);
    }, 3000);
  };

  const handleDeleteWebhook = async (id: string) => {
    // In a real app, delete from Supabase
    // const { error } = await supabase
    //   .from('webhooks')
    //   .delete()
    //   .eq('id', id);
    // 
    // if (error) {
    //   console.error('Error deleting webhook:', error);
    //   return;
    // }

    const updatedWebhooks = webhooks.filter((webhook) => webhook.id !== id);
    setWebhooks(updatedWebhooks);
  };

  const handleTestWebhook = async (webhook: Webhook) => {
    // In a real app, send a test event to the webhook URL
    // For demo, simulate success/failure
    setTestResponse({ success: true, message: 'Test webhook sent successfully.' });
    
    // In a real implementation, you would make an actual HTTP request:
    // try {
    //   const response = await fetch('/api/webhooks/test', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ url: webhook.url, secret: webhook.secret }),
    //   });
    //   
    //   if (!response.ok) throw new Error('Failed to send test webhook');
    //   
    //   setTestResponse({ success: true, message: 'Test webhook sent successfully.' });
    // } catch (error) {
    //   setTestResponse({
    //     success: false,
    //     message: `Failed to send test webhook: ${error.message}`,
    //   });
    // }
  };

  // Generate a random webhook secret
  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 24;
    let secret = 'whsec_';
    
    for (let i = 0; i < length; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return secret;
  };

  const toggleWebhookStatus = async (webhook: Webhook) => {
    const updatedWebhook = { ...webhook, active: !webhook.active };
    
    // In a real app, update in Supabase
    // const { error } = await supabase
    //   .from('webhooks')
    //   .update({ active: updatedWebhook.active })
    //   .eq('id', webhook.id);
    // 
    // if (error) {
    //   console.error('Error updating webhook status:', error);
    //   return;
    // }

    const updatedWebhooks = webhooks.map((wh) =>
      wh.id === webhook.id ? updatedWebhook : wh
    );
    setWebhooks(updatedWebhooks);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const toggleEventSelection = (eventValue: string) => {
    if (!selectedWebhook) return;

    const updatedEvents = selectedWebhook.events.includes(eventValue)
      ? selectedWebhook.events.filter(e => e !== eventValue)
      : [...selectedWebhook.events, eventValue];

    setSelectedWebhook({
      ...selectedWebhook,
      events: updatedEvents,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Webhook Integrations</h1>
          <Button onClick={handleCreateWebhook}>New Webhook</Button>
        </div>

        {testResponse && (
          <Alert variant={testResponse.success ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {testResponse.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{testResponse.message}</AlertDescription>
            </div>
          </Alert>
        )}

        {selectedWebhook ? (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">
              {selectedWebhook.id.startsWith('temp_')
                ? 'Create a New Webhook'
                : 'Edit Webhook'}
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Webhook Name</Label>
                <Input
                  id="name"
                  value={selectedWebhook.name}
                  onChange={(e) =>
                    setSelectedWebhook({ ...selectedWebhook, name: e.target.value })
                  }
                  placeholder="e.g., Make.com Invoice Integration"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                  id="url"
                  value={selectedWebhook.url}
                  onChange={(e) =>
                    setSelectedWebhook({ ...selectedWebhook, url: e.target.value })
                  }
                  placeholder="https://hook.make.com/your-webhook-endpoint"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the webhook URL provided by Make.com or your integration platform.
                </p>
              </div>

              <div>
                <Label>Events to Trigger</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  {availableEvents.map((event) => (
                    <div key={event.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event.value}
                        checked={selectedWebhook.events.includes(event.value)}
                        onChange={() => toggleEventSelection(event.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={event.value} className="text-sm cursor-pointer">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="secret">Webhook Secret</Label>
                <div className="flex mt-1">
                  <Input
                    id="secret"
                    value={selectedWebhook.secret}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => copyToClipboard(selectedWebhook.secret)}
                  >
                    {copiedSecret ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This secret key is used to validate webhook requests. Keep it confidential.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedWebhook.active}
                  onCheckedChange={(checked) =>
                    setSelectedWebhook({ ...selectedWebhook, active: checked })
                  }
                  id="active"
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedWebhook(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestWebhook(selectedWebhook)}
                >
                  Test Webhook
                </Button>
                <Button 
                  variant="default"
                  onClick={() => handleSaveWebhook(selectedWebhook)}
                >
                  Save Webhook
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Configured Webhooks</h2>
            {webhooks.length === 0 ? (
              <p className="text-muted-foreground">No webhooks configured yet.</p>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <h3 className="font-medium">{webhook.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{webhook.url}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {webhook.events.map((event) => {
                          const eventInfo = availableEvents.find(e => e.value === event);
                          return (
                            <span
                              key={event}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                            >
                              {eventInfo?.label || event}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3 md:mt-0">
                      <div className="flex items-center">
                        <span className={`inline-flex h-2 w-2 rounded-full ${webhook.active ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                        <span className="text-sm">{webhook.active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWebhookStatus(webhook)}
                      >
                        {webhook.active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWebhook(webhook)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Webhook Documentation</h2>
          <div className="space-y-4">
            <p>
              Webhooks allow your application to send real-time event notifications to other services like Make.com.
              When an event occurs in your application, a webhook will send an HTTP POST request to the configured URL.
            </p>
            
            <div>
              <h3 className="font-medium mb-2">Webhook Payload Format</h3>
              <Textarea
                readOnly
                value={JSON.stringify({
                  event: 'invoice.created',
                  data: {
                    id: '123',
                    number: 'INV-001',
                    amount: 2500,
                    customer: {
                      id: '456',
                      name: 'Acme Corporation'
                    },
                    created_at: '2023-06-01T15:30:00Z'
                  },
                  timestamp: '2023-06-01T15:30:00Z'
                }, null, 2)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Verifying Webhook Signatures</h3>
              <p className="text-sm text-muted-foreground">
                For security, webhooks are signed with an HMAC signature. Verify the signature by computing an HMAC with the webhook secret and the request body.
              </p>
              <pre className="bg-gray-100 p-2 mt-2 text-sm font-mono overflow-x-auto rounded">
                {`// Node.js example
const crypto = require('crypto');
const secret = 'whsec_...'; // Your webhook secret
const signature = req.headers['x-webhook-signature'];
const payload = req.body;

const hmac = crypto.createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');

if (hmac === signature) {
  // Signature is valid
  // Process the webhook
}`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}