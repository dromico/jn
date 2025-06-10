"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

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
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  total: number;
  type: "invoice" | "quotation";
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  companyDetails: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#2563eb",
  },
  section: {
    marginBottom: 15,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBlock: {
    width: "48%",
  },
  labelText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  valueText: {
    fontSize: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    alignItems: "center",
  },
  column: {
    flex: 1,
  },
  table: {
    marginTop: 25,
    marginBottom: 25,
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2563eb",
    paddingVertical: 10,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
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
    textAlign: "center",
  },
  amountCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    textAlign: "right",
  },
  total: {
    marginTop: 30,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
    paddingRight: 8,
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  type: "invoice" | "quotation";
}

// Helper function to format dates (removing time)
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

export default function InvoicePDF({ invoice, type }: InvoicePDFProps) {
  const totalAmount = invoice.items.reduce(
    (sum: number, item) => sum + item.quantity * item.price,
    0,
  );
  const documentTitle = type === "invoice" ? "INVOICE" : "QUOTATION";

  return (
    <PDFViewer style={{ width: "100%", height: "700px" }} data-oid="wa1y3n3">
      <Document data-oid="jx8q9g7">
        <Page size="A4" style={styles.page} data-oid="8frq9k5">
          {/* Company Letterhead */}
          <View style={styles.header} data-oid="vd9bxdf">
            <Text style={styles.companyName} data-oid="10g69:m">
              Jaya Nexus Sdn Bhd (1195753-P)
            </Text>
            <Text style={styles.companyDetails} data-oid="zq3.b2d">
              1-2 (Level 2), Jalan Sb Indah 5/2,
            </Text>
            <Text style={styles.companyDetails} data-oid="8rwo0rv">
              Taman SB Indah, 43300 Seri Kembangan, Selangor
            </Text>
            <Text style={styles.companyDetails} data-oid="3hkrfu8">
              Email: contact@jayanexus.com
            </Text>
          </View>

          <Text style={styles.title} data-oid="1fe:c4o">
            {documentTitle}
          </Text>

          {/* Invoice/Quotation Details and Customer Info in two columns */}
          <View style={styles.infoSection} data-oid="_whyrhs">
            <View style={styles.infoBlock} data-oid="ttj.t5v">
              <Text style={styles.labelText} data-oid="4ni:41g">
                Document Number:
              </Text>
              <Text
                style={styles.valueText}
                data-oid="0db6px:"
              >{`${invoice.number}`}</Text>

              <Text style={styles.labelText} data-oid="2iw3z5.">
                Date:
              </Text>
              <Text style={styles.valueText} data-oid="0oi9_hd">
                {formatDate(invoice.date)}
              </Text>

              {type === "invoice" && (
                <>
                  <Text style={styles.labelText} data-oid="dde916j">
                    Due Date:
                  </Text>
                  <Text style={styles.valueText} data-oid="d:re2:d">
                    {formatDate(invoice.due_date)}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.infoBlock} data-oid="3r9t440">
              <Text style={styles.labelText} data-oid=".h:k_hc">
                Bill To:
              </Text>
              <Text style={styles.valueText} data-oid="ykv13kh">
                {invoice.customer_name || "N/A"}
              </Text>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.table} data-oid="hx.0jv6">
            <View style={styles.tableHeader} data-oid="dw5xn8q">
              <Text
                style={[styles.tableHeaderCell, styles.descriptionCell]}
                data-oid="asc6as2"
              >
                Description
              </Text>
              <Text
                style={[styles.tableHeaderCell, styles.quantityCell]}
                data-oid="eg4k5vt"
              >
                Qty
              </Text>
              <Text
                style={[styles.tableHeaderCell, styles.amountCell]}
                data-oid="vx_2xcj"
              >
                Price (RM)
              </Text>
              <Text
                style={[styles.tableHeaderCell, styles.amountCell]}
                data-oid="nkr1dko"
              >
                Total (RM)
              </Text>
            </View>

            {invoice.items.map((item, index: number) => (
              <View key={index} style={styles.row} data-oid="v:moh-u">
                <Text
                  style={[styles.tableCell, styles.descriptionCell]}
                  data-oid="cnlefyj"
                >
                  {item.description}
                </Text>
                <Text
                  style={[styles.tableCell, styles.quantityCell]}
                  data-oid="_1ohej."
                >
                  {item.quantity}
                </Text>
                <Text
                  style={[styles.tableCell, styles.amountCell]}
                  data-oid="g3u:w3s"
                >
                  {item.price.toFixed(2)}
                </Text>
                <Text
                  style={[styles.tableCell, styles.amountCell]}
                  data-oid="jnzii0k"
                >
                  {(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.total} data-oid="-k.kegf">
            <Text data-oid="qpv.y2:">Total: RM {totalAmount.toFixed(2)}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer} data-oid=".ffb65b">
            <Text data-oid="rsxwrwe">Thank you for your business!</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
