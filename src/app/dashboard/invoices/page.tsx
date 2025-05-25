"use client";









import { useState, useEffect } from 'react';




import { useRouter } from 'next/navigation';




import DashboardLayout from '@/components/layout/dashboard-layout';




import { Card } from '@/components/ui/card';




import { Button } from '@/components/ui/button';




import { Input } from '@/components/ui/input';




import { Label } from '@/components/ui/label';




import { Switch } from '@/components/ui/switch';




import InvoicePDF from '@/components/invoices/invoice-pdf';




import type { Database } from '@/lib/database.types';




import { browserSupabase, enhanceErrorMessage } from '@/lib/supabase';
import { SchemaErrorNotification } from '@/components/invoices/error-helper';









// Types for invoice and quotation




interface Customer {




  id: string;




  name: string;




  email: string | null;




  address: string | null;




}









interface InvoiceItem {




  id: string;




  description: string;




  quantity: number;




  price: number;




}









interface Invoice {




  id: string;




  number: string;




  customer_id: string | null;




  customer_name: string | null;




  date: string;




  due_date: string;




  items: InvoiceItem[];




  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';




  total: number;




  type: 'invoice' | 'quotation';




}









// Helper function to format dates in DD-MM-YYYY format




const formatDateDisplay = (dateString: string): string => {




  if (!dateString) return '';




  try {




    const date = new Date(dateString);




    const day = date.getDate().toString().padStart(2, '0');




    const month = (date.getMonth() + 1).toString().padStart(2, '0');




    const year = date.getFullYear();




    return `${day}-${month}-${year}`;




  } catch (e) {




    console.error('Error formatting date:', e);




    return dateString;




  }




};









export default function InvoicesPage() {




  const router = useRouter();




  const [loading, setLoading] = useState(true);




  const [invoices, setInvoices] = useState<Invoice[]>([]);




  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);




  const [activeTab, setActiveTab] = useState('all');




  const [userId, setUserId] = useState<string | null>(null);




  const [error, setError] = useState<string | null>(null);




  const [showPDF, setShowPDF] = useState(false);




  const [isInvoiceType, setIsInvoiceType] = useState(true);









  useEffect(() => {




    const checkAuth = async () => {




      try {




        const { data: { session } } = await browserSupabase.auth.getSession();




        if (!session) {




          router.push('/login');




          return;




        }




        setUserId(session.user.id);




        fetchData(session.user.id);




      } catch (err) {




        console.error('Authentication error:', err);




        setError('Authentication failed. Please try logging in again.');




        setLoading(false);




      }




    };









    checkAuth();




  }, [router]);









  const fetchData = async (userId: string) => {




    setLoading(true);




    try {




      // Fetch invoices with their items




      const { data: invoicesData, error: invoicesError } = await browserSupabase




        .from('invoices')




        .select(`




          *,




          invoice_items (*)




        `)




        .eq('user_id', userId)




        .order('created_at', { ascending: false });









      if (invoicesError) throw invoicesError;









      const transformedInvoices = invoicesData.map(invoice => ({




        ...invoice,




        items: Array.isArray(invoice.invoice_items)




          ? invoice.invoice_items.map(item => ({




              id: item.id,




              description: item.description,




              quantity: item.quantity,




              price: item.price




            }))




          : [],




        type: invoice.type || 'invoice' // Default to invoice if type is not set




      }));









      setInvoices(transformedInvoices);




    } catch (error: any) {




      console.error('Error fetching data:', error);




      setError(`Error loading data: ${error.message}`);




    } finally {




      setLoading(false);




    }




  };









  const handleCreateInvoice = async () => {




    if (!userId) {




      setError('You must be logged in to create invoices');




      return;




    }









    const type = isInvoiceType ? 'invoice' : 'quotation';




    const prefix = isInvoiceType ? 'INV' : 'QT';




    const number = `${prefix}-00${invoices.length + 1}`;









    const newInvoice: Invoice = {




      id: `temp_${Date.now()}`,




      number,




      customer_id: null,




      customer_name: "",




      date: new Date().toISOString().split('T')[0],




      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],




      items: [{ id: `temp_item_${Date.now()}`, description: '', quantity: 1, price: 0 }],




      status: 'draft',




      total: 0,




      type




    };









    setSelectedInvoice(newInvoice);




    setShowPDF(false);




  };









  const handleSaveInvoice = async () => {




    if (!selectedInvoice) return;




    if (!userId) {




      setError('You must be logged in to save invoices');




      return;




    }









    // Validate required fields




    if (!selectedInvoice.number || selectedInvoice.number.trim() === '') {




      alert('Please provide an invoice number');




      return;




    }









    // Customer validation - either customer_id or customer_name must be provided




    if (!selectedInvoice.customer_name || selectedInvoice.customer_name.trim() === '') {




      alert('Please provide a customer name');




      return;




    }









    // Date validation




    if (!selectedInvoice.date) {




      alert('Please provide an invoice date');




      return;




    }









    // Due date validation




    if (isInvoiceType && !selectedInvoice.due_date) {




      alert('Please provide a due date');




      return;




    }









    setLoading(true);




    setError(null);









    try {




      // Calculate total




      const total = selectedInvoice.items.reduce(




        (sum, item) => sum + (item.quantity * item.price), 0




      );









      // Prepare invoice data with proper customer handling




      const invoiceData = {




        user_id: userId,




        number: selectedInvoice.number,




        customer_id: null,




        customer_name: selectedInvoice.customer_name,




        date: selectedInvoice.date,




        due_date: selectedInvoice.due_date,




        status: selectedInvoice.status,




        total,




        type: selectedInvoice.type // Ensure the type is saved




      };









      // Debug logging




      console.log('Saving invoice with data:', invoiceData);









      // Get the latest session to ensure auth token is fresh




      const { data: { session } } = await browserSupabase.auth.getSession();




      if (!session) {




        setError('Your session has expired. Please log in again.');




        router.push('/login');




        return;




      }









      if (selectedInvoice.id.startsWith('temp_')) {




        // Create new invoice




        const { data: invoice, error: invoiceError } = await browserSupabase




          .from('invoices')




          .insert([invoiceData])




          .select()




          .single();









        if (invoiceError) {




          console.error('Invoice creation error:', invoiceError);




          setError(`Error creating invoice: ${enhanceErrorMessage(invoiceError)}`);




          return;




        }









        if (!invoice) {




          throw new Error('Failed to create invoice, no data returned');




        }









        // Create invoice items




        if (selectedInvoice.items.length > 0) {




          const { error: itemsError } = await browserSupabase




            .from('invoice_items')




            .insert(




              selectedInvoice.items.map(item => ({




                invoice_id: invoice.id,




                description: item.description || '',




                quantity: item.quantity || 0,




                price: item.price || 0




              }))




            );









          if (itemsError) {




            console.error('Invoice items creation error:', itemsError);




            setError(`Error creating invoice items: ${itemsError.message}`);




            return;




          }




        }




      } else {




        // Update existing invoice




        const { error: invoiceError } = await browserSupabase




          .from('invoices')




          .update({




            user_id: userId,




            number: selectedInvoice.number,




            customer_id: null,




            customer_name: selectedInvoice.customer_name,




            date: selectedInvoice.date,




            due_date: selectedInvoice.due_date,




            status: selectedInvoice.status,




            total,




            type: selectedInvoice.type, // Ensure the type is updated




            updated_at: new Date().toISOString()




          })




          .eq('id', selectedInvoice.id);









        if (invoiceError) {




          console.error('Invoice update error:', invoiceError);




          setError(`Error updating invoice: ${invoiceError.message}`);




          return;




        }









        // Delete existing items




        const { error: deleteError } = await browserSupabase




          .from('invoice_items')




          .delete()




          .eq('invoice_id', selectedInvoice.id);









        if (deleteError && !deleteError.message.includes('no rows')) {




          console.error('Invoice items deletion error:', deleteError);




          setError(`Error deleting old invoice items: ${deleteError.message}`);




          return;




        }









        // Create new items




        if (selectedInvoice.items.length > 0) {




          const { error: itemsError } = await browserSupabase




            .from('invoice_items')




            .insert(




              selectedInvoice.items.map(item => ({




                invoice_id: selectedInvoice.id,




                description: item.description || '',




                quantity: item.quantity || 0,




                price: item.price || 0




              }))




            );









          if (itemsError) {




            console.error('Invoice items creation error:', itemsError);




            setError(`Error creating invoice items: ${itemsError.message}`);




            return;




          }




        }




      }









      // Refresh the invoices list




      if (userId) {




        fetchData(userId);




      }









      setSelectedInvoice(null);




      alert('Invoice saved successfully!');




    } catch (error: any) {




      console.error('Error saving invoice:', error);




      setError(`Failed to save invoice: ${error.message}`);




    } finally {




      setLoading(false);




    }




  };









  const handleDeleteInvoice = async (id: string) => {




    if (!confirm('Are you sure you want to delete this invoice?')) return;









    try {




      setLoading(true);




      setError(null);









      // Delete invoice items first (foreign key constraint)




      const { error: itemsError } = await browserSupabase




        .from('invoice_items')




        .delete()




        .eq('invoice_id', id);









      if (itemsError && !itemsError.message.includes('no rows')) {




        setError(`Error deleting invoice items: ${itemsError.message}`);




        return;




      }









      // Delete the invoice




      const { error: invoiceError } = await browserSupabase




        .from('invoices')




        .delete()




        .eq('id', id);









      if (invoiceError) {




        setError(`Error deleting invoice: ${invoiceError.message}`);




        return;




      }









      setInvoices(invoices.filter(invoice => invoice.id !== id));




      alert('Invoice deleted successfully!');




    } catch (error: any) {




      console.error('Error deleting invoice:', error);




      setError(`Error deleting invoice: ${error.message}`);




    } finally {




      setLoading(false);




    }




  };









  const handleEditInvoice = (invoice: Invoice) => {




    // Make sure we have a proper copy of the invoice with items




    setSelectedInvoice({




      ...invoice,




      items: Array.isArray(invoice.items) ? [...invoice.items] : []




    });









    // Set document type based on the invoice type




    setIsInvoiceType(invoice.type === 'invoice');




  };









  const addInvoiceItem = () => {




    if (selectedInvoice) {




      const newItem = {




        id: `temp_item_${Date.now()}`,




        description: '',




        quantity: 1,




        price: 0




      };









      setSelectedInvoice({




        ...selectedInvoice,




        items: [...selectedInvoice.items, newItem]




      });




    }




  };









  const updateInvoiceItem = (itemId: string, field: string, value: string | number) => {




    if (!selectedInvoice) return;









    const updatedItems = selectedInvoice.items.map(item => {




      if (item.id === itemId) {




        return { ...item, [field]: value };




      }




      return item;




    });









    setSelectedInvoice({




      ...selectedInvoice,




      items: updatedItems




    });




  };









  const removeInvoiceItem = (itemId: string) => {




    if (!selectedInvoice) return;









    setSelectedInvoice({




      ...selectedInvoice,




      items: selectedInvoice.items.filter(item => item.id !== itemId)




    });




  };









  const toggleDocumentType = () => {




    setIsInvoiceType(!isInvoiceType);




    if (selectedInvoice) {




      const type = !isInvoiceType ? 'invoice' : 'quotation';




      const prefix = !isInvoiceType ? 'INV' : 'QT';




      const number = `${prefix}-${selectedInvoice.number.split('-')[1]}`;




      setSelectedInvoice({




        ...selectedInvoice,




        type,




        number




      });




    }




  };









  return (




    <DashboardLayout>




      <div className="flex flex-col space-y-6">




        <div className="flex justify-between items-center">




          <h1 className="text-2xl font-bold tracking-tight">Invoices & Quotations</h1>




          <div className="flex items-center gap-4">




            <div className="flex items-center gap-2">




              <Switch




                checked={isInvoiceType}




                onCheckedChange={toggleDocumentType}




                id="document-type"




              />




              <Label htmlFor="document-type">




                {isInvoiceType ? 'Invoice' : 'Quotation'}




              </Label>




            </div>




            <Button onClick={handleCreateInvoice} disabled={loading}>




              New {isInvoiceType ? 'Invoice' : 'Quotation'}




            </Button>




          </div>




        </div>









        {error && (




          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">




            <span className="block sm:inline">{error}</span>




            <button




              onClick={() => setError(null)}




              className="absolute top-0 bottom-0 right-0 px-4 py-3"




            >




              <span className="sr-only">Close</span>




              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">




                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />




              </svg>




            </button>




          </div>




        )}









        {loading ? (




          <Card className="p-6">




            <div className="flex items-center justify-center h-32">




              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>




            </div>




          </Card>




        ) : selectedInvoice ? (




          <>




            {!showPDF ? (




              <Card className="p-6">




                <h2 className="text-lg font-medium mb-4">




                  {selectedInvoice.id.startsWith('temp_')




                    ? `Create New ${isInvoiceType ? 'Invoice' : 'Quotation'}`




                    : `Edit ${isInvoiceType ? 'Invoice' : 'Quotation'}`}




                </h2>









                <div className="space-y-6">




                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">




                    <div>




                      <Label htmlFor="number">{isInvoiceType ? 'Invoice' : 'Quotation'} Number</Label>




                      <Input




                        id="number"




                        value={selectedInvoice.number}




                        onChange={(e) =>




                          setSelectedInvoice({ ...selectedInvoice, number: e.target.value })




                        }




                        className="mt-1"




                      />




                    </div>









                    <div>




                      <Label htmlFor="customerName">Customer Name</Label>




                      <Input




                        id="customerName"




                        value={selectedInvoice.customer_name || ''}




                        onChange={(e) =>




                          setSelectedInvoice({




                            ...selectedInvoice,




                            customer_id: null,




                            customer_name: e.target.value




                          })




                        }




                        placeholder="Enter customer name"




                      />




                    </div>




                  </div>









                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">




                    <div>




                      <Label htmlFor="date">Date</Label>




                      <Input




                        id="date"




                        type="date"




                        value={selectedInvoice.date}




                        onChange={(e) =>




                          setSelectedInvoice({ ...selectedInvoice, date: e.target.value })




                        }




                        className="mt-1"




                      />




                    </div>









                    {isInvoiceType && (




                      <div>




                        <Label htmlFor="dueDate">Due Date</Label>




                        <Input




                          id="dueDate"




                          type="date"




                          value={selectedInvoice.due_date}




                          onChange={(e) =>




                            setSelectedInvoice({ ...selectedInvoice, due_date: e.target.value })




                          }




                          className="mt-1"




                        />




                      </div>




                    )}




                  </div>









                  <div>




                    <h3 className="text-md font-medium mb-2">Items</h3>




                    <table className="min-w-full divide-y divide-gray-200">




                      <thead className="bg-gray-50 dark:bg-gray-700">




                        <tr>




                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                            Description




                          </th>




                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                            Quantity




                          </th>




                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                            Price (RM)




                          </th>




                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                            Total (RM)




                          </th>




                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          </th>




                        </tr>




                      </thead>




                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">




                        {selectedInvoice.items.map((item) => (




                          <tr key={item.id}>




                            <td className="px-6 py-4 whitespace-nowrap">




                              <Input




                                value={item.description}




                                onChange={(e) =>




                                  updateInvoiceItem(item.id, 'description', e.target.value)




                                }




                                className="w-full"




                              />




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              <Input




                                type="number"




                                value={item.quantity}




                                onChange={(e) =>




                                  updateInvoiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0)




                                }




                                className="w-full"




                              />




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              <Input




                                type="number"




                                value={item.price}




                                onChange={(e) =>




                                  updateInvoiceItem(item.id, 'price', parseFloat(e.target.value) || 0)




                                }




                                className="w-full"




                              />




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              RM {(item.quantity * item.price).toFixed(2)}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              <Button




                                variant="ghost"




                                size="sm"




                                onClick={() => removeInvoiceItem(item.id)}




                              >




                                Remove




                              </Button>




                            </td>




                          </tr>




                        ))}




                      </tbody>




                    </table>









                    <Button




                      variant="outline"




                      onClick={addInvoiceItem}




                      className="mt-4"




                    >




                      Add Item




                    </Button>




                  </div>









                  <div className="flex justify-between border-t pt-4">




                    <div>




                      <Label htmlFor="status">Status</Label>




                      <select




                        id="status"




                        value={selectedInvoice.status}




                        onChange={(e) =>




                          setSelectedInvoice({




                            ...selectedInvoice,




                            status: e.target.value as Invoice['status']




                          })




                        }




                        className="w-full p-2 border rounded mt-1"




                      >




                        <option value="draft">Draft</option>




                        <option value="sent">Sent</option>




                        <option value="paid">Paid</option>




                        <option value="overdue">Overdue</option>




                        <option value="cancelled">Cancelled</option>




                      </select>




                    </div>









                    <div className="text-right">




                      <span className="text-sm text-muted-foreground">Total:</span>




                      <div className="text-2xl font-bold">




                        RM {selectedInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}




                      </div>




                    </div>




                  </div>









                  <div className="flex justify-end space-x-4 mt-4">




                    <Button




                      variant="outline"




                      onClick={() => {




                        setSelectedInvoice(null);




                        setError(null);




                      }}




                      disabled={loading}




                    >




                      Cancel




                    </Button>




                    <Button




                      variant="outline"




                      onClick={() => setShowPDF(true)}




                      disabled={loading}




                    >




                      Preview PDF




                    </Button>




                    <Button




                      variant="default"




                      onClick={handleSaveInvoice}




                      disabled={loading}




                    >




                      {loading ? 'Saving...' : `Save ${isInvoiceType ? 'Invoice' : 'Quotation'}`}




                    </Button>




                  </div>




                </div>




              </Card>




            ) : (




              <Card className="p-6">




                <div className="flex justify-end mb-4">




                  <Button




                    variant="outline"




                    onClick={() => setShowPDF(false)}




                    className="mr-2"




                  >




                    Back to Edit




                  </Button>




                </div>




                <InvoicePDF invoice={selectedInvoice} type={selectedInvoice.type} />




              </Card>




            )}




          </>




        ) : (




          <>




            <div className="flex space-x-4 mb-4 overflow-x-auto">




              <Button




                variant={activeTab === 'all' ? 'default' : 'outline'}




                onClick={() => setActiveTab('all')}




              >




                All




              </Button>




              <Button




                variant={activeTab === 'draft' ? 'default' : 'outline'}




                onClick={() => setActiveTab('draft')}




              >




                Draft




              </Button>




              <Button




                variant={activeTab === 'sent' ? 'default' : 'outline'}




                onClick={() => setActiveTab('sent')}




              >




                Sent




              </Button>




              <Button




                variant={activeTab === 'paid' ? 'default' : 'outline'}




                onClick={() => setActiveTab('paid')}




              >




                Paid




              </Button>




            </div>









            <Card className="p-6">




              <h2 className="text-lg font-medium mb-4">Your Documents</h2>




              {invoices.length === 0 ? (




                <div className="text-center py-8 text-muted-foreground">




                  No documents found. Click "New {isInvoiceType ? 'Invoice' : 'Quotation'}" to create one.




                </div>




              ) : (




                <div className="overflow-x-auto">




                  <table className="min-w-full divide-y divide-gray-200">




                    <thead className="bg-gray-50 dark:bg-gray-700">




                      <tr>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Type




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Number




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Customer




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Date




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Due Date




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Status




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Total




                        </th>




                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">




                          Actions




                        </th>




                      </tr>




                    </thead>




                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">




                      {invoices




                        .filter(invoice => activeTab === 'all' || invoice.status === activeTab)




                        .map((invoice) => (




                          <tr key={invoice.id}>




                            <td className="px-6 py-4 whitespace-nowrap">




                              {invoice.type === 'invoice' ? 'Invoice' : 'Quotation'}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              {invoice.number}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              {invoice.customer_name}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              {formatDateDisplay(invoice.date)}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              {invoice.type === 'invoice' ? formatDateDisplay(invoice.due_date) : '-'}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              <span className={`




                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium




                                ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :




                                  invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :




                                  invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :




                                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :




                                  'bg-yellow-100 text-yellow-800'}




                              `}>




                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}




                              </span>




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              RM {parseFloat(String(invoice.total)).toFixed(2)}




                            </td>




                            <td className="px-6 py-4 whitespace-nowrap">




                              <div className="flex space-x-2">




                                <Button




                                  variant="outline"




                                  size="sm"




                                  onClick={() => {




                                    handleEditInvoice(invoice);




                                    setIsInvoiceType(invoice.type === 'invoice');




                                  }}




                                  disabled={loading}




                                >




                                  Edit




                                </Button>




                                <Button




                                  variant="outline"




                                  size="sm"




                                  onClick={() => {




                                    setSelectedInvoice(invoice);




                                    setShowPDF(true);




                                    setIsInvoiceType(invoice.type === 'invoice');




                                  }}




                                  disabled={loading}




                                >




                                  View PDF




                                </Button>




                                <Button




                                  variant="outline"




                                  size="sm"




                                  onClick={() => handleDeleteInvoice(invoice.id)}




                                  disabled={loading}




                                >




                                  Delete




                                </Button>




                              </div>




                            </td>




                          </tr>




                        ))}




                    </tbody>




                  </table>




                </div>




              )}




            </Card>




          </>




        )}




      </div>




    </DashboardLayout>




  );




}