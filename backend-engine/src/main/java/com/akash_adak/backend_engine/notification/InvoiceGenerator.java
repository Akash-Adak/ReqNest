package com.akash_adak.backend_engine.notification;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

public class InvoiceGenerator {

    // Company details
    private static final String COMPANY_NAME = "ReqNest Technologies Pvt. Ltd.";
    private static final String COMPANY_ADDRESS = "Tech Park, Level 5, Sector 62, Kolkata, West Bengal 201309";
    private static final String COMPANY_PHONE = "+91 8653026878";
    private static final String COMPANY_EMAIL = "reqnest@gmail.com";
    private static final String COMPANY_WEBSITE = "www.reqnest.com";
    private static final String COMPANY_GSTIN = "29ABCDE1234F1Z5";
    private static final String COMPANY_PAN = "ABCDE1234F";
    private static final double GST_RATE = 18.0; // 18% GST

    // Logo path - adjust based on your actual file location
    private static final String LOGO_PATH = "src/main/resources/static/company-logo.png";

    public static byte[] generateInvoice(EmailRequest request) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Create document with margins
            Document document = new Document(PageSize.A4, 36, 36, 90, 36);
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            // Add header and footer
            HeaderFooter event = new HeaderFooter();
            writer.setPageEvent(event);

            document.open();

            // Add company header with logo area
            addCompanyHeader(document, writer);

            // Add invoice title and details
            addInvoiceTitle(document, request);

            // Add billed to and invoice details
            addBillingDetails(document, request);

            // Add item description table
            addItemTable(document, request);

            // Add payment summary with GST breakdown
            addPaymentSummary(document, request);

            // Add terms and conditions
            addTermsAndConditions(document);

            // Add thank you message
            addThankYouMessage(document);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

    private static void addCompanyHeader(Document document, PdfWriter writer) throws DocumentException {
        // Create a table for company header
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setSpacingAfter(15);

        // Company details (left side)
        PdfPCell companyCell = new PdfPCell();
        companyCell.setBorder(Rectangle.NO_BORDER);
        companyCell.setPadding(5);

        Paragraph companyName = new Paragraph(COMPANY_NAME,
                new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, new BaseColor(33, 97, 128)));
        companyCell.addElement(companyName);

        Paragraph companyAddress = new Paragraph(COMPANY_ADDRESS,
                new Font(Font.FontFamily.HELVETICA, 9));
        companyAddress.setSpacingAfter(3);
        companyCell.addElement(companyAddress);

        Paragraph contactInfo = new Paragraph("Phone: " + COMPANY_PHONE + " | Email: " + COMPANY_EMAIL,
                new Font(Font.FontFamily.HELVETICA, 8));
        contactInfo.setSpacingAfter(3);
        companyCell.addElement(contactInfo);

        Paragraph taxInfo = new Paragraph("GSTIN: " + COMPANY_GSTIN + " | PAN: " + COMPANY_PAN,
                new Font(Font.FontFamily.HELVETICA, 8, Font.BOLD));
        companyCell.addElement(taxInfo);

        headerTable.addCell(companyCell);

        // Logo (right side)
        PdfPCell logoCell = new PdfPCell();
        logoCell.setBorder(Rectangle.NO_BORDER);
        logoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        logoCell.setVerticalAlignment(Element.ALIGN_TOP);
        logoCell.setPadding(5);

        try {
            // Load and add the company logo
            Image logo = Image.getInstance(LOGO_PATH);
            logo.scaleToFit(80, 80); // Adjust size as needed
            logo.setAlignment(Element.ALIGN_RIGHT);
            logoCell.addElement(logo);
        } catch (Exception e) {
            // If logo cannot be loaded, add a placeholder text
            Paragraph logoPlaceholder = new Paragraph("[Company Logo]",
                    new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, BaseColor.LIGHT_GRAY));
            logoPlaceholder.setAlignment(Element.ALIGN_RIGHT);
            logoCell.addElement(logoPlaceholder);
            System.err.println("Logo not found at: " + LOGO_PATH + ". Using placeholder instead.");
        }

        headerTable.addCell(logoCell);

        document.add(headerTable);

        // Add separator line
        addLineSeparator(document);
    }

    private static void addInvoiceTitle(Document document, EmailRequest request) throws DocumentException {
        // Invoice title and details table
        PdfPTable titleTable = new PdfPTable(2);
        titleTable.setWidthPercentage(100);
        titleTable.setSpacingAfter(15);

        // Invoice title
        PdfPCell titleCell = new PdfPCell();
        titleCell.setBorder(Rectangle.NO_BORDER);
        titleCell.setPadding(5);

        Paragraph invoiceTitle = new Paragraph("TAX INVOICE",
                new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY));
        titleCell.addElement(invoiceTitle);

        titleTable.addCell(titleCell);

        // Invoice details (right side)
        PdfPCell detailsCell = new PdfPCell();
        detailsCell.setBorder(Rectangle.NO_BORDER);
        detailsCell.setPadding(5);
        detailsCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        // Generate invoice number
        String invoiceNumber = "RN-INV-" + (1000 + (int)(Math.random() * 9000));
        LocalDateTime now = LocalDateTime.now();
        String invoiceDate = now.format(DateTimeFormatter.ofPattern("dd MMM, yyyy"));

        detailsCell.addElement(new Paragraph("Invoice No: " + invoiceNumber,
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD)));
        detailsCell.addElement(new Paragraph("Date: " + invoiceDate,
                new Font(Font.FontFamily.HELVETICA, 10)));

        titleTable.addCell(detailsCell);

        document.add(titleTable);
    }

    private static void addBillingDetails(Document document, EmailRequest request) throws DocumentException {
        // Create a two-column table for billing details
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        // Billed to section
        PdfPCell billedToCell = new PdfPCell();
        billedToCell.setBorder(Rectangle.NO_BORDER);
        billedToCell.setPadding(8);
        billedToCell.setBackgroundColor(new BaseColor(240, 240, 240));

        Paragraph billedToTitle = new Paragraph("BILL TO:",
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.DARK_GRAY));
        billedToCell.addElement(billedToTitle);
        billedToCell.addElement(new Paragraph(request.getTo(),
                new Font(Font.FontFamily.HELVETICA, 12)));
        billedToCell.addElement(new Paragraph(" "));

        table.addCell(billedToCell);

        // Subscription details
        PdfPCell subscriptionCell = new PdfPCell();
        subscriptionCell.setBorder(Rectangle.NO_BORDER);
        subscriptionCell.setPadding(8);
        subscriptionCell.setBackgroundColor(new BaseColor(240, 240, 240));

        Paragraph subscriptionTitle = new Paragraph("SUBSCRIPTION DETAILS:",
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.DARK_GRAY));
        subscriptionCell.addElement(subscriptionTitle);
        subscriptionCell.addElement(new Paragraph("Plan: " + request.getPlan(),
                new Font(Font.FontFamily.HELVETICA, 10)));
        subscriptionCell.addElement(new Paragraph("Valid Until: " + request.getValidUntil(),
                new Font(Font.FontFamily.HELVETICA, 10)));

        table.addCell(subscriptionCell);

        document.add(table);
    }

    private static void addItemTable(Document document, EmailRequest request) throws DocumentException {
        // Parse amount to calculate GST
        double amount = Double.parseDouble(request.getAmount());
        double gstAmount = (amount * GST_RATE) / (100 + GST_RATE);
        double taxableAmount = amount - gstAmount;
        double sgst = gstAmount / 2;
        double cgst = gstAmount / 2;

        // Create table for item description
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(20);

        // Set column widths
        float[] columnWidths = {3f, 1f, 1f, 1f, 1f};
        table.setWidths(columnWidths);

        // Table headers
        addTableHeader(table, "DESCRIPTION");
        addTableHeader(table, "HSN/SAC");
        addTableHeader(table, "QTY");
        addTableHeader(table, "RATE (₹)");
        addTableHeader(table, "AMOUNT (₹)");

        // Add subscription item
        PdfPCell descCell = new PdfPCell(new Paragraph(request.getPlan() + " Subscription\n" +
                "Subscription for software services",
                new Font(Font.FontFamily.HELVETICA, 10)));
        descCell.setPadding(8);
        table.addCell(descCell);

        PdfPCell hsnCell = new PdfPCell(new Paragraph("9984",
                new Font(Font.FontFamily.HELVETICA, 10)));
        hsnCell.setPadding(8);
        hsnCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(hsnCell);

        PdfPCell qtyCell = new PdfPCell(new Paragraph("1",
                new Font(Font.FontFamily.HELVETICA, 10)));
        qtyCell.setPadding(8);
        qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(qtyCell);

        PdfPCell rateCell = new PdfPCell(new Paragraph(String.format("₹%.2f", taxableAmount),
                new Font(Font.FontFamily.HELVETICA, 10)));
        rateCell.setPadding(8);
        rateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(rateCell);

        PdfPCell amountCell = new PdfPCell(new Paragraph(String.format("₹%.2f", taxableAmount),
                new Font(Font.FontFamily.HELVETICA, 10)));
        amountCell.setPadding(8);
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(amountCell);

        document.add(table);
    }

    private static void addTableHeader(PdfPTable table, String text) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(new BaseColor(33, 97, 128));
        header.setBorderWidth(1);
        header.setPhrase(new Phrase(text, new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE)));
        header.setPadding(8);
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(header);
    }

    private static void addPaymentSummary(Document document, EmailRequest request) throws DocumentException {
        // Parse amount to calculate GST breakdown
        double amount = Double.parseDouble(request.getAmount());
        double gstAmount = (amount * GST_RATE) / (100 + GST_RATE);
        double taxableAmount = amount - gstAmount;
        double sgst = gstAmount / 2;
        double cgst = gstAmount / 2;

        // Create a table for payment summary
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(40);
        table.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.setSpacingBefore(10);

        // Set column widths
        float[] columnWidths = {2f, 1f};
        table.setWidths(columnWidths);

        // Taxable value
        addSummaryRow(table, "Taxable Value:", String.format("₹%.2f", taxableAmount));

        // CGST
        addSummaryRow(table, "CGST @ " + (GST_RATE/2) + "%:", String.format("₹%.2f", cgst));

        // SGST
        addSummaryRow(table, "SGST @ " + (GST_RATE/2) + "%:", String.format("₹%.2f", sgst));

        // Total GST
        addSummaryRow(table, "Total GST:", String.format("₹%.2f", gstAmount));

        // Grand Total
        PdfPCell totalLabelCell = new PdfPCell(new Paragraph("GRAND TOTAL:",
                new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD)));
        totalLabelCell.setBorder(Rectangle.TOP);
        totalLabelCell.setPadding(8);
        totalLabelCell.setBackgroundColor(new BaseColor(240, 240, 240));
        table.addCell(totalLabelCell);

        PdfPCell totalValueCell = new PdfPCell(new Paragraph(String.format("₹%.2f", amount),
                new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD)));
        totalValueCell.setBorder(Rectangle.TOP);
        totalValueCell.setPadding(8);
        totalValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalValueCell.setBackgroundColor(new BaseColor(240, 240, 240));
        table.addCell(totalValueCell);

        // Amount in words
        PdfPCell wordsCell = new PdfPCell(new Paragraph("Amount in words: " + convertToWords(amount),
                new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC)));
        wordsCell.setBorder(Rectangle.NO_BORDER);
        wordsCell.setColspan(2);
        wordsCell.setPadding(5);
        table.addCell(wordsCell);

        document.add(table);
    }

    private static void addSummaryRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label,
                new Font(Font.FontFamily.HELVETICA, 9)));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(value,
                new Font(Font.FontFamily.HELVETICA, 9)));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private static void addTermsAndConditions(Document document) throws DocumentException {
        Paragraph termsTitle = new Paragraph("Terms & Conditions:",
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD));
        termsTitle.setSpacingBefore(20);
        document.add(termsTitle);

        List termsList = new List(List.UNORDERED);
        termsList.setIndentationLeft(10);
        termsList.add(new ListItem("Payment is due within 15 days of invoice date",
                new Font(Font.FontFamily.HELVETICA, 8)));
        termsList.add(new ListItem("Late payments are subject to a fee of 1.5% per month",
                new Font(Font.FontFamily.HELVETICA, 8)));
        termsList.add(new ListItem("All amounts are in Indian Rupees (₹)",
                new Font(Font.FontFamily.HELVETICA, 8)));
        termsList.add(new ListItem("This is a computer generated invoice",
                new Font(Font.FontFamily.HELVETICA, 8)));

        document.add(termsList);
    }

    private static void addThankYouMessage(Document document) throws DocumentException {
        Paragraph thanks = new Paragraph("Thank you for your business!",
                new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, new BaseColor(33, 97, 128)));
        thanks.setSpacingBefore(20);
        thanks.setAlignment(Element.ALIGN_CENTER);
        document.add(thanks);

        Paragraph note = new Paragraph("For any questions regarding this invoice, please contact " + COMPANY_EMAIL,
                new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY));
        note.setSpacingBefore(5);
        note.setAlignment(Element.ALIGN_CENTER);
        document.add(note);
    }

    private static void addLineSeparator(Document document) throws DocumentException {
        // Create a custom line separator using a table with a single cell
        PdfPTable lineTable = new PdfPTable(1);
        lineTable.setWidthPercentage(100);
        lineTable.setSpacingBefore(10);
        lineTable.setSpacingAfter(10);

        PdfPCell lineCell = new PdfPCell();
        lineCell.setFixedHeight(1);
        lineCell.setBorder(Rectangle.BOTTOM);
        lineCell.setBorderColor(new BaseColor(200, 200, 200));
        lineCell.setBorderWidth(1);
        lineCell.setPadding(0);

        lineTable.addCell(lineCell);
        document.add(lineTable);
    }

    // Helper method to convert amount to words
    private static String convertToWords(double number) {
        // Simplified implementation - in a real scenario, use a more robust solution
        try {
            long amount = (long) number;
            long decimals = Math.round((number - amount) * 100);

            if (amount == 0) {
                return "Zero Rupees and " + decimals + " Paise Only";
            }

            String words = convertNumberToWords(amount) + " Rupees";

            if (decimals > 0) {
                words += " and " + convertNumberToWords(decimals) + " Paise";
            }

            return words + " Only";
        } catch (Exception e) {
            return "Amount in words unavailable";
        }
    }

    private static String convertNumberToWords(long number) {
        // Simplified number to words conversion
        String[] units = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
        String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};

        if (number < 20) {
            return units[(int) number];
        }

        if (number < 100) {
            return tens[(int) number / 10] + ((number % 10 != 0) ? " " + units[(int) number % 10] : "");
        }

        if (number < 1000) {
            return units[(int) number / 100] + " Hundred" + ((number % 100 != 0) ? " and " + convertNumberToWords(number % 100) : "");
        }

        if (number < 100000) {
            return convertNumberToWords(number / 1000) + " Thousand" + ((number % 1000 != 0) ? " " + convertNumberToWords(number % 1000) : "");
        }

        if (number < 10000000) {
            return convertNumberToWords(number / 100000) + " Lakh" + ((number % 100000 != 0) ? " " + convertNumberToWords(number % 100000) : "");
        }

        return convertNumberToWords(number / 10000000) + " Crore" + ((number % 10000000 != 0) ? " " + convertNumberToWords(number % 10000000) : "");
    }

    // Inner class for header and footer
    static class HeaderFooter extends PdfPageEventHelper {
        public void onEndPage(PdfWriter writer, Document document) {
            try {
                // Add footer with page number and company info
                PdfPTable footer = new PdfPTable(2);
                footer.setTotalWidth(document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin());

                // Left side - page number
                PdfPCell pageCell = new PdfPCell(new Paragraph("Page " + writer.getPageNumber(),
                        new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, BaseColor.GRAY)));
                pageCell.setBorder(Rectangle.NO_BORDER);
                pageCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                // Right side - company info
                PdfPCell infoCell = new PdfPCell(new Paragraph(COMPANY_NAME + " | " + COMPANY_WEBSITE,
                        new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, BaseColor.GRAY)));
                infoCell.setBorder(Rectangle.NO_BORDER);
                infoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                footer.addCell(pageCell);
                footer.addCell(infoCell);

                footer.writeSelectedRows(0, -1, document.leftMargin(), document.bottomMargin() - 10, writer.getDirectContent());
            } catch (Exception e) {
                throw new ExceptionConverter(e);
            }
        }
    }
}