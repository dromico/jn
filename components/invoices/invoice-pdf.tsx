"use client";

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Define the interface for invoice items
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

// Define the interface for invoices
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
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  companyDetails: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2563eb',
  },
  section: {
    marginBottom: 15,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBlock: {
    width: '48%',
  },
  labelText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  table: {
    marginTop: 25,
    marginBottom: 25,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2563eb',
    paddingVertical: 10,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
  },
  descriptionCell: {
    flex: 2,
    padding: 8,
    fontSize: 10,
  },
  quantityCell: {
    flex: 0.5,
    padding: 8,
    fontSize: 10,
    textAlign: 'center',
  },
  amountCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    textAlign: 'right',
  },
  total: {
    marginTop: 30,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    paddingRight: 8,
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 15,
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
  }
});

interface InvoicePDFProps {
  invoice: Invoice;
  type: 'invoice' | 'quotation';
}

// Helper function to format dates (removing time)
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export default function InvoicePDF({ invoice, type }: InvoicePDFProps) {
  const totalAmount = invoice.items.reduce((sum: number, item) => sum + (item.quantity * item.price), 0);
  const documentTitle = type === 'invoice' ? 'INVOICE' : 'QUOTATION';
  
  return (
    <PDFViewer style={{ width: '100%', height: '700px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Company Letterhead */}
          <View style={styles.header}>
            <Text style={styles.companyName}>Jaya Nexus Sdn Bhd (1195753-P)</Text>
            <Text style={styles.companyDetails}>1-2 (Level 2), Jalan Sb Indah 5/2,</Text>
            <Text style={styles.companyDetails}>Taman SB Indah, 43300 Seri Kembangan, Selangor</Text>
            <Text style={styles.companyDetails}>Email: contact@jayanexus.com</Text>
          </View>

          <Text style={styles.title}>{documentTitle}</Text>

          {/* Invoice/Quotation Details and Customer Info in two columns */}
          <View style={styles.infoSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.labelText}>Document Number:</Text>
              <Text style={styles.valueText}>{`${invoice.number}`}</Text>
              
              <Text style={styles.labelText}>Date:</Text>
              <Text style={styles.valueText}>{formatDate(invoice.date)}</Text>
              
              {type === 'invoice' && (
                <>
                  <Text style={styles.labelText}>Due Date:</Text>
                  <Text style={styles.valueText}>{formatDate(invoice.due_date)}</Text>
                </>
              )}
            </View>
            
            <View style={styles.infoBlock}>
              <Text style={styles.labelText}>Bill To:</Text>
              <Text style={styles.valueText}>{invoice.customer_name || 'N/A'}</Text>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.descriptionCell]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.quantityCell]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.amountCell]}>Price (RM)</Text>
              <Text style={[styles.tableHeaderCell, styles.amountCell]}>Total (RM)</Text>
            </View>
            
            {invoice.items.map((item, index: number) => (
              <View key={index} style={styles.row}>
                <Text style={[styles.tableCell, styles.descriptionCell]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.quantityCell]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.amountCell]}>{item.price.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.amountCell]}>{(item.quantity * item.price).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.total}>
            <Text>Total: RM {totalAmount.toFixed(2)}</Text>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text>Thank you for your business!</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}