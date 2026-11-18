"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: "hero" | "feature" | "testimonial" | "faq" | "contact";
  position: number;
  is_published: boolean;
}

// Mock data for demo purposes
const mockContentSections: ContentSection[] = [
  {
    id: "1",
    title: "Hero Section",
    content: "Empower Your Business with Our Innovative Solutions",
    type: "hero",
    position: 1,
    is_published: true,
  },
  {
    id: "2",
    title: "About Us Section",
    content:
      "We are a team of dedicated professionals committed to providing high-quality services to businesses of all sizes.",
    type: "feature",
    position: 2,
    is_published: true,
  },
  {
    id: "3",
    title: "Services",
    content:
      "Our comprehensive suite of services includes web development, digital marketing, and business consulting.",
    type: "feature",
    position: 3,
    is_published: true,
  },
  {
    id: "4",
    title: "Testimonial - John Smith",
    content:
      '"Working with this team has been an incredible experience. They delivered beyond our expectations."',
    type: "testimonial",
    position: 4,
    is_published: true,
  },
  {
    id: "5",
    title: "Contact Information",
    content:
      "Email: info@example.com\nPhone: (123) 456-7890\nAddress: 123 Business Street, Suite 100",
    type: "contact",
    position: 5,
    is_published: true,
  },
];

export default function ContentPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [savedMessage, setSavedMessage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
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

  const filteredSections =
    activeTab === "all"
      ? sections
      : sections.filter((section) => section.type === activeTab);

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
    const updatedSections = sections.map((section) =>
      section.id === selectedSection.id ? selectedSection : section,
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
      title: "New Section",
      content: "Enter your content here...",
      type: "feature",
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
    const updatedSections = sections.filter((section) => section.id !== id);
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
    const updatedSections = sections.map((s) =>
      s.id === section.id ? updatedSection : s,
    );
    setSections(updatedSections);
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (
      (direction === "up" && sectionIndex === 0) ||
      (direction === "down" && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const swapIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1;

    // Swap positions
    [newSections[sectionIndex].position, newSections[swapIndex].position] = [
      newSections[swapIndex].position,
      newSections[sectionIndex].position,
    ];

    // Swap elements in array
    [newSections[sectionIndex], newSections[swapIndex]] = [
      newSections[swapIndex],
      newSections[sectionIndex],
    ];

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
    <DashboardLayout data-oid="9u7k2fo">
      <div className="flex flex-col space-y-6" data-oid="2vr3a-h">
        <div className="flex justify-between items-center" data-oid="8k260t2">
          <h1 className="text-2xl font-bold tracking-tight" data-oid="e1x_:tv">
            Content Management
          </h1>
          <div className="flex gap-2" data-oid="kjwy6.7">
            <Button variant="outline" asChild data-oid="ao:08f8">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-oid=".98v4b_"
              >
                Preview Site
              </a>
            </Button>
            <Button onClick={handleCreateSection} data-oid="cwxuctb">
              Add Section
            </Button>
          </div>
        </div>

        {savedMessage && (
          <Alert data-oid="usddy3g">
            <div className="flex items-center gap-2" data-oid="brnn9oq">
              <CheckCircle2
                className="h-4 w-4 text-green-500"
                data-oid="cs7ldrh"
              />
              <AlertDescription data-oid="kz_ascb">
                Content saved successfully!
              </AlertDescription>
            </div>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          data-oid="wk-q08."
        >
          <TabsList className="grid grid-cols-6 w-full" data-oid="_.qkw8k">
            <TabsTrigger value="all" data-oid="d0in32s">
              All
            </TabsTrigger>
            <TabsTrigger value="hero" data-oid="k96:.p5">
              Hero
            </TabsTrigger>
            <TabsTrigger value="feature" data-oid="e0o.er3">
              Features
            </TabsTrigger>
            <TabsTrigger value="testimonial" data-oid="89fq2ld">
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="faq" data-oid="47rum_h">
              FAQs
            </TabsTrigger>
            <TabsTrigger value="contact" data-oid="8o36_mi">
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4" data-oid="050j1v2">
            {selectedSection ? (
              <Card className="p-6" data-oid="1w:2cxn">
                <h2 className="text-lg font-medium mb-4" data-oid="7lqj2:k">
                  {selectedSection.id.startsWith("temp_")
                    ? "Create New Section"
                    : "Edit Section"}
                </h2>

                <div className="space-y-6" data-oid="jmdd-xt">
                  <div data-oid="o_8o_c2">
                    <Label htmlFor="title" data-oid="0wx-pwg">
                      Section Title
                    </Label>
                    <Input
                      id="title"
                      value={selectedSection.title}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          title: e.target.value,
                        })
                      }
                      className="mt-1"
                      data-oid=".nu8y9h"
                    />
                  </div>

                  <div data-oid="a5.bg9d">
                    <Label htmlFor="content" data-oid="sr3jgu6">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      value={selectedSection.content}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          content: e.target.value,
                        })
                      }
                      rows={6}
                      className="mt-1"
                      data-oid="588a8-z"
                    />
                  </div>

                  <div data-oid="_jb1twe">
                    <Label htmlFor="type" data-oid="3q_jcf3">
                      Section Type
                    </Label>
                    <select
                      id="type"
                      value={selectedSection.type}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full p-2 border rounded mt-1"
                      data-oid="95_9v:5"
                    >
                      <option value="hero" data-oid="9tn_fw_">
                        Hero Section
                      </option>
                      <option value="feature" data-oid="1nkg56u">
                        Feature
                      </option>
                      <option value="testimonial" data-oid="erx.jwu">
                        Testimonial
                      </option>
                      <option value="faq" data-oid="x8bw51k">
                        FAQ
                      </option>
                      <option value="contact" data-oid="5zx8v-7">
                        Contact
                      </option>
                    </select>
                  </div>

                  <div
                    className="flex items-center space-x-2"
                    data-oid="0hm30kd"
                  >
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={selectedSection.is_published}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          is_published: e.target.checked,
                        })
                      }
                      data-oid="otp5a-:"
                    />

                    <Label htmlFor="is_published" data-oid="e_fcpeb">
                      Published
                    </Label>
                  </div>

                  <div
                    className="flex justify-end space-x-4 mt-4"
                    data-oid="p:_uo:x"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSection(null)}
                      data-oid="cw6snwq"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleSaveSection}
                      data-oid="_tc4sw4"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4" data-oid="11fzfqp">
                {filteredSections.length === 0 ? (
                  <Card className="p-6" data-oid="7ety.r_">
                    <p className="text-muted-foreground" data-oid="oeg89ns">
                      No content sections found.
                    </p>
                  </Card>
                ) : (
                  filteredSections.map((section) => (
                    <Card key={section.id} className="p-6" data-oid="-:-gej2">
                      <div
                        className="flex flex-col md:flex-row justify-between"
                        data-oid="pzvqvjx"
                      >
                        <div data-oid="o989kl7">
                          <div
                            className="flex items-center gap-2"
                            data-oid="2eeaw8a"
                          >
                            <h3
                              className="text-lg font-medium"
                              data-oid="-j8xtdv"
                            >
                              {section.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                section.is_published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                              data-oid="vz5_1rq"
                            >
                              {section.is_published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p
                            className="text-sm text-muted-foreground mt-1"
                            data-oid="6kk2hzc"
                          >
                            Type:{" "}
                            {section.type.charAt(0).toUpperCase() +
                              section.type.slice(1)}
                          </p>
                        </div>
                        <div
                          className="flex items-center space-x-2 mt-2 md:mt-0"
                          data-oid="_h64yo0"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, "up")}
                            disabled={section.position === 1}
                            data-oid="5gf2kx9"
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
                              data-oid="t3muue4"
                            >
                              <path d="m5 12 7-7 7 7" data-oid="msj3zxb" />
                              <path d="M12 19V5" data-oid="e:lbhmx" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, "down")}
                            disabled={section.position === sections.length}
                            data-oid="m9s6wd-"
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
                              data-oid="5fbg187"
                            >
                              <path d="M12 5v14" data-oid="7weqvwd" />
                              <path d="m19 12-7 7-7-7" data-oid="wkxox0n" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePublishStatus(section)}
                            data-oid="rr:rdp6"
                          >
                            {section.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSection(section)}
                            data-oid="5g:f33r"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                            data-oid="-n0bd0q"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-4" data-oid="m:in3vz">
                        <div className="prose max-w-none" data-oid="77zgf_h">
                          <pre
                            className="text-sm whitespace-pre-wrap"
                            data-oid="goa3bcd"
                          >
                            {section.content}
                          </pre>
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
