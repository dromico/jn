"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'hero' | 'feature' | 'testimonial' | 'faq' | 'contact';
  position: number;
  is_published: boolean;
}

// Mock data for demo purposes
const mockContentSections: ContentSection[] = [
  {
    id: '1',
    title: 'Hero Section',
    content: 'Empower Your Business with Our Innovative Solutions',
    type: 'hero',
    position: 1,
    is_published: true,
  },
  {
    id: '2',
    title: 'About Us Section',
    content: 'We are a team of dedicated professionals committed to providing high-quality services to businesses of all sizes.',
    type: 'feature',
    position: 2,
    is_published: true,
  },
  {
    id: '3',
    title: 'Services',
    content: 'Our comprehensive suite of services includes web development, digital marketing, and business consulting.',
    type: 'feature',
    position: 3,
    is_published: true,
  },
  {
    id: '4',
    title: 'Testimonial - John Smith',
    content: '"Working with this team has been an incredible experience. They delivered beyond our expectations."',
    type: 'testimonial',
    position: 4,
    is_published: true,
  },
  {
    id: '5',
    title: 'Contact Information',
    content: 'Email: info@example.com\nPhone: (123) 456-7890\nAddress: 123 Business Street, Suite 100',
    type: 'contact',
    position: 5,
    is_published: true,
  },
];

export default function ContentPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [savedMessage, setSavedMessage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Set preview URL (in a real app, this would be your actual site URL)
      setPreviewUrl(window.location.origin);

      // For demo purposes or when Supabase is not configured, use mock data
      setSections(mockContentSections);

      // In a real app with Supabase configured, you would fetch data like this:
      // const fetchContent = async () => {
      //   try {
      //     const { data, error } = await supabase
      //       .from('content_sections')
      //       .select('*')
      //       .order('position', { ascending: true });
      //
      //     if (error) {
      //       console.error('Error fetching content:', error);
      //       return;
      //     }
      //
      //     if (data && data.length > 0) {
      //       setSections(data);
      //     } else {
      //       // Fallback to mock data if no data is returned
      //       setSections(mockContentSections);
      //     }
      //   } catch (err) {
      //     console.error('Failed to fetch content sections:', err);
      //     // Fallback to mock data on error
      //     setSections(mockContentSections);
      //   }
      // };
      //
      // fetchContent();
    }
  }, []);

  const filteredSections = activeTab === 'all'
    ? sections
    : sections.filter(section => section.type === activeTab);

  const handleEditSection = (section: ContentSection) => {
    setSelectedSection(section);
  };

  const handleSaveSection = async () => {
    if (!selectedSection) return;

    // In a real app, save to Supabase
    // const { error } = await supabase
    //   .from('content_sections')
    //   .update({
    //     title: selectedSection.title,
    //     content: selectedSection.content,
    //     is_published: selectedSection.is_published,
    //   })
    //   .eq('id', selectedSection.id);
    //
    // if (error) {
    //   console.error('Error saving content:', error);
    //   return;
    // }

    // Update local state
    const updatedSections = sections.map(section =>
      section.id === selectedSection.id ? selectedSection : section
    );

    setSections(updatedSections);
    setSelectedSection(null);

    // Show saved message
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
    }, 3000);
  };

  const handleCreateSection = () => {
    // Create a new content section
    const newSection: ContentSection = {
      id: `temp_${Date.now()}`,
      title: 'New Section',
      content: 'Enter your content here...',
      type: 'feature',
      position: sections.length + 1,
      is_published: false,
    };

    setSelectedSection(newSection);
  };

  const handleDeleteSection = async (id: string) => {
    // In a real app, delete from Supabase
    // const { error } = await supabase
    //   .from('content_sections')
    //   .delete()
    //   .eq('id', id);
    //
    // if (error) {
    //   console.error('Error deleting section:', error);
    //   return;
    // }

    // Update local state
    const updatedSections = sections.filter(section => section.id !== id);
    setSections(updatedSections);
  };

  const togglePublishStatus = async (section: ContentSection) => {
    const updatedSection = { ...section, is_published: !section.is_published };

    // In a real app, update in Supabase
    // const { error } = await supabase
    //   .from('content_sections')
    //   .update({ is_published: updatedSection.is_published })
    //   .eq('id', section.id);
    //
    // if (error) {
    //   console.error('Error updating publish status:', error);
    //   return;
    // }

    // Update local state
    const updatedSections = sections.map(s =>
      s.id === section.id ? updatedSection : s
    );
    setSections(updatedSections);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const swapIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

    // Swap positions
    [newSections[sectionIndex].position, newSections[swapIndex].position] =
      [newSections[swapIndex].position, newSections[sectionIndex].position];

    // Swap elements in array
    [newSections[sectionIndex], newSections[swapIndex]] =
      [newSections[swapIndex], newSections[sectionIndex]];

    setSections(newSections);

    // In a real app, also update positions in database
    // const batch = [
    //   { id: newSections[sectionIndex].id, position: newSections[sectionIndex].position },
    //   { id: newSections[swapIndex].id, position: newSections[swapIndex].position }
    // ];
    //
    // supabase.from('content_sections').upsert(batch);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                Preview Site
              </a>
            </Button>
            <Button onClick={handleCreateSection}>Add Section</Button>
          </div>
        </div>

        {savedMessage && (
          <Alert>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>Content saved successfully!</AlertDescription>
            </div>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="feature">Features</TabsTrigger>
            <TabsTrigger value="testimonial">Testimonials</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {selectedSection ? (
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">
                  {selectedSection.id.startsWith('temp_')
                    ? 'Create New Section'
                    : 'Edit Section'}
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Section Title</Label>
                    <Input
                      id="title"
                      value={selectedSection.title}
                      onChange={(e) => setSelectedSection({ ...selectedSection, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={selectedSection.content}
                      onChange={(e) => setSelectedSection({ ...selectedSection, content: e.target.value })}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Section Type</Label>
                    <select
                      id="type"
                      value={selectedSection.type}
                      onChange={(e) => setSelectedSection({ ...selectedSection, type: e.target.value as any })}
                      className="w-full p-2 border rounded mt-1"
                    >
                      <option value="hero">Hero Section</option>
                      <option value="feature">Feature</option>
                      <option value="testimonial">Testimonial</option>
                      <option value="faq">FAQ</option>
                      <option value="contact">Contact</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={selectedSection.is_published}
                      onChange={(e) => setSelectedSection({ ...selectedSection, is_published: e.target.checked })}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>

                  <div className="flex justify-end space-x-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSection(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleSaveSection}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSections.length === 0 ? (
                  <Card className="p-6">
                    <p className="text-muted-foreground">No content sections found.</p>
                  </Card>
                ) : (
                  filteredSections.map((section) => (
                    <Card key={section.id} className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{section.title}</h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                section.is_published
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {section.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Type: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 md:mt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, 'up')}
                            disabled={section.position === 1}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m5 12 7-7 7 7" />
                              <path d="M12 19V5" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, 'down')}
                            disabled={section.position === sections.length}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 5v14" />
                              <path d="m19 12-7 7-7-7" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePublishStatus(section)}
                          >
                            {section.is_published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSection(section)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-4">
                        <div className="prose max-w-none">
                          <pre className="text-sm whitespace-pre-wrap">{section.content}</pre>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}