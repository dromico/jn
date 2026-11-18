"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Clipboard, Check } from "lucide-react";

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  created_at: string;
  last_triggered?: string;
  last_status?: "success" | "error";
}

const availableEvents = [
  { value: "invoice.created", label: "Invoice Created" },
  { value: "invoice.paid", label: "Invoice Paid" },
  { value: "quote.created", label: "Quotation Created" },
  { value: "quote.approved", label: "Quotation Approved" },
  { value: "todo.created", label: "Task Created" },
  { value: "todo.completed", label: "Task Completed" },
];

// Mock data for demo purposes
const mockWebhooks: Webhook[] = [
  {
    id: "1",
    name: "Make.com Invoice Integration",
    url: "https://hook.make.com/abc123456789",
    events: ["invoice.created", "invoice.paid"],
    active: true,
    secret: "whsec_abc123456789",
    created_at: "2023-05-15T10:00:00Z",
    last_triggered: "2023-06-01T15:30:00Z",
    last_status: "success",
  },
  {
    id: "2",
    name: "Task Notifications",
    url: "https://hook.make.com/def987654321",
    events: ["todo.created", "todo.completed"],
    active: false,
    secret: "whsec_def987654321",
    created_at: "2023-05-20T14:22:00Z",
  },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [testResponse, setTestResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
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
      name: "",
      url: "",
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
        message:
          "Please fill in all required fields and select at least one event.",
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
    if (webhook.id.startsWith("temp_")) {
      const newId = (webhooks.length + 1).toString();
      updatedWebhooks = [...webhooks, { ...webhook, id: newId }];
    } else {
      updatedWebhooks = webhooks.map((wh) =>
        wh.id === webhook.id ? webhook : wh,
      );
    }

    setWebhooks(updatedWebhooks);
    setSelectedWebhook(null);
    setTestResponse({
      success: true,
      message: "Webhook saved successfully.",
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
    setTestResponse({
      success: true,
      message: "Test webhook sent successfully.",
    });

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
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 24;
    let secret = "whsec_";

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
      wh.id === webhook.id ? updatedWebhook : wh,
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
      ? selectedWebhook.events.filter((e) => e !== eventValue)
      : [...selectedWebhook.events, eventValue];

    setSelectedWebhook({
      ...selectedWebhook,
      events: updatedEvents,
    });
  };

  return (
    <DashboardLayout data-oid="so_udmk">
      <div className="flex flex-col space-y-6" data-oid="_ob00c:">
        <div className="flex justify-between items-center" data-oid="qcjzmv9">
          <h1 className="text-2xl font-bold tracking-tight" data-oid="-1uzun.">
            Webhook Integrations
          </h1>
          <Button onClick={handleCreateWebhook} data-oid="swyak7y">
            New Webhook
          </Button>
        </div>

        {testResponse && (
          <Alert
            variant={testResponse.success ? "default" : "destructive"}
            data-oid=":s8c76t"
          >
            <div className="flex items-center gap-2" data-oid="j-saygj">
              {testResponse.success ? (
                <CheckCircle2 className="h-4 w-4" data-oid="_xmp.ib" />
              ) : (
                <AlertCircle className="h-4 w-4" data-oid="6bk5n55" />
              )}
              <AlertDescription data-oid=".fuz651">
                {testResponse.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {selectedWebhook ? (
          <Card className="p-6" data-oid="9ihgx0y">
            <h2 className="text-lg font-medium mb-4" data-oid="va4vn.a">
              {selectedWebhook.id.startsWith("temp_")
                ? "Create a New Webhook"
                : "Edit Webhook"}
            </h2>

            <div className="space-y-6" data-oid="kcet6f.">
              <div data-oid="tn1e5jn">
                <Label htmlFor="name" data-oid="mk5180n">
                  Webhook Name
                </Label>
                <Input
                  id="name"
                  value={selectedWebhook.name}
                  onChange={(e) =>
                    setSelectedWebhook({
                      ...selectedWebhook,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Make.com Invoice Integration"
                  className="mt-1"
                  data-oid="h-0wurm"
                />
              </div>

              <div data-oid="i-xl_b-">
                <Label htmlFor="url" data-oid="fwf1xqc">
                  Webhook URL
                </Label>
                <Input
                  id="url"
                  value={selectedWebhook.url}
                  onChange={(e) =>
                    setSelectedWebhook({
                      ...selectedWebhook,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://hook.make.com/your-webhook-endpoint"
                  className="mt-1"
                  data-oid="da91mro"
                />

                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid="rtax9dp"
                >
                  Enter the webhook URL provided by Make.com or your integration
                  platform.
                </p>
              </div>

              <div data-oid="qryydf7">
                <Label data-oid="vzc52dg">Events to Trigger</Label>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1"
                  data-oid="z2b_of9"
                >
                  {availableEvents.map((event) => (
                    <div
                      key={event.value}
                      className="flex items-center space-x-2"
                      data-oid="l:n212t"
                    >
                      <input
                        type="checkbox"
                        id={event.value}
                        checked={selectedWebhook.events.includes(event.value)}
                        onChange={() => toggleEventSelection(event.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        data-oid="d:-17gh"
                      />

                      <Label
                        htmlFor={event.value}
                        className="text-sm cursor-pointer"
                        data-oid="58w5:pv"
                      >
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div data-oid="mfyaitg">
                <Label htmlFor="secret" data-oid="l3kx682">
                  Webhook Secret
                </Label>
                <div className="flex mt-1" data-oid="spid66r">
                  <Input
                    id="secret"
                    value={selectedWebhook.secret}
                    readOnly
                    className="flex-1"
                    data-oid="m.612i_"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => copyToClipboard(selectedWebhook.secret)}
                    data-oid="b5vr08h"
                  >
                    {copiedSecret ? (
                      <Check className="h-4 w-4" data-oid="ttykgj2" />
                    ) : (
                      <Clipboard className="h-4 w-4" data-oid="5i_-oqj" />
                    )}
                  </Button>
                </div>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid="b2ox51q"
                >
                  This secret key is used to validate webhook requests. Keep it
                  confidential.
                </p>
              </div>

              <div className="flex items-center space-x-2" data-oid=":jv:::x">
                <Switch
                  checked={selectedWebhook.active}
                  onCheckedChange={(checked) =>
                    setSelectedWebhook({ ...selectedWebhook, active: checked })
                  }
                  id="active"
                  data-oid="l-.893y"
                />

                <Label htmlFor="active" data-oid="yxfof3i">
                  Active
                </Label>
              </div>

              <div
                className="flex justify-end space-x-4 mt-4"
                data-oid="fy:6mjq"
              >
                <Button
                  variant="outline"
                  onClick={() => setSelectedWebhook(null)}
                  data-oid="6w_hwso"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestWebhook(selectedWebhook)}
                  data-oid="l3mwr02"
                >
                  Test Webhook
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleSaveWebhook(selectedWebhook)}
                  data-oid="c5sy6l2"
                >
                  Save Webhook
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6" data-oid="cy82rr_">
            <h2 className="text-lg font-medium mb-4" data-oid="1yjp.5.">
              Configured Webhooks
            </h2>
            {webhooks.length === 0 ? (
              <p className="text-muted-foreground" data-oid="jitm70x">
                No webhooks configured yet.
              </p>
            ) : (
              <div className="space-y-4" data-oid="9dkh..4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                    data-oid="7h9gj4_"
                  >
                    <div data-oid="rfd3vhg">
                      <h3 className="font-medium" data-oid="0b8hsxz">
                        {webhook.name}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground mt-1"
                        data-oid="0gopr2j"
                      >
                        {webhook.url}
                      </p>
                      <div
                        className="flex flex-wrap gap-1 mt-2"
                        data-oid="8lbygw5"
                      >
                        {webhook.events.map((event) => {
                          const eventInfo = availableEvents.find(
                            (e) => e.value === event,
                          );
                          return (
                            <span
                              key={event}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                              data-oid="i9:i55m"
                            >
                              {eventInfo?.label || event}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="flex items-center space-x-2 mt-3 md:mt-0"
                      data-oid=".g3:xuo"
                    >
                      <div className="flex items-center" data-oid="vxklgn8">
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${webhook.active ? "bg-green-500" : "bg-gray-300"} mr-2`}
                          data-oid="dyjfcnt"
                        ></span>
                        <span className="text-sm" data-oid="9vnji1f">
                          {webhook.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWebhookStatus(webhook)}
                        data-oid="5myiukk"
                      >
                        {webhook.active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWebhook(webhook)}
                        data-oid="66b6cga"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        data-oid="v6.k47w"
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

        <Card className="p-6" data-oid="dk9vze-">
          <h2 className="text-lg font-medium mb-4" data-oid="ywjv4la">
            Webhook Documentation
          </h2>
          <div className="space-y-4" data-oid="imrwvlc">
            <p data-oid="xfvhx70">
              Webhooks allow your application to send real-time event
              notifications to other services like Make.com. When an event
              occurs in your application, a webhook will send an HTTP POST
              request to the configured URL.
            </p>

            <div data-oid="28xioku">
              <h3 className="font-medium mb-2" data-oid="s2mcvj.">
                Webhook Payload Format
              </h3>
              <Textarea
                readOnly
                value={JSON.stringify(
                  {
                    event: "invoice.created",
                    data: {
                      id: "123",
                      number: "INV-001",
                      amount: 2500,
                      customer: {
                        id: "456",
                        name: "Acme Corporation",
                      },
                      created_at: "2023-06-01T15:30:00Z",
                    },
                    timestamp: "2023-06-01T15:30:00Z",
                  },
                  null,
                  2,
                )}
                rows={10}
                className="font-mono text-sm"
                data-oid="7t7m_:f"
              />
            </div>

            <div data-oid="6ohn6z7">
              <h3 className="font-medium mb-2" data-oid="ljzqia_">
                Verifying Webhook Signatures
              </h3>
              <p className="text-sm text-muted-foreground" data-oid="qj4n_by">
                For security, webhooks are signed with an HMAC signature. Verify
                the signature by computing an HMAC with the webhook secret and
                the request body.
              </p>
              <pre
                className="bg-gray-100 p-2 mt-2 text-sm font-mono overflow-x-auto rounded"
                data-oid="juj.mjs"
              >
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
