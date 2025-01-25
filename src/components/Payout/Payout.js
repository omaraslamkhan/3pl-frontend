import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Payout = forwardRef(({ data }, ref) => {
  const printRef = useRef();

  useImperativeHandle(ref, () => ({
    generatePDF: async () => {
      try {
        const input = printRef.current;
        if (!input) {
          console.error("Print reference is not available.");
          return;
        }

        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');

        if (!imgData.startsWith('data:image/png')) {
          console.error("Invalid image data format.");
          return;
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Marjan_Payout.pdf');
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  }));

  return (
    <div style={{ position: 'absolute', left: '-9999px', color: 'black', fontWeight: 400 }}>
      <div ref={printRef} style={{ padding: '10px', backgroundColor: '#fff' }}>
        <h3 style={{color: '#444159', fontWeight: 'bold', textAlign: 'center'}}>3PL VALLEY - Marjan Payout</h3>
        <div style={{width: '100%'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <tr>
                  <th>Payout Date</th>
                  <th style={{color: '#0056ff'}}>Amount</th>
                  <th>Seller</th>
                  <th style={{color: '#ef0002'}}>Previous</th>
                  <th>Last Sequence</th>
                  <th>Net</th>
                </tr>
                <tr>
                  <td style={{textAlign: 'center'}}>{data.payoutDate}</td>
                  <td style={{textAlign: 'center', color: '#0056ff'}}>{data.amount}</td>
                  <td style={{textAlign: 'center'}}>{data.seller}</td>
                  <td style={{textAlign: 'center', color: '#ef0002'}}>{data.previous}</td>
                  <td style={{textAlign: 'center'}}>{data.lastSequence}</td>
                  <td style={{textAlign: 'center'}}>{data.net}</td>
                </tr>
              </table>
        </div>

        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th style={{color: '#0056ff'}}>COD</th>
              <th style={{color: '#0056ff'}}>Shipper Ref</th>
              <th>Description</th>
              <th>PCs</th>
              <th>Account Name</th>
              <th>Status</th>
              <th>Mode</th>
              <th style={{color: '#0056ff'}}>Charges</th>
              <th>Item Rate</th>
              <th>Amt</th>
              <th style={{color: '#0056ff'}}>COD</th>
              <th>Net Payable</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td>{item.no}</td>
                <td>{item.date}</td>
                <td style={{color: '#0056ff'}}>{item.cod}</td>
                <td style={{color: '#0056ff'}}>{item.shipperRef}</td>
                <td>{item.description}</td>
                <td>{item.pcs}</td>
                <td>{item.accountName}</td>
                <td>{item.status}</td>
                <td>{item.mode}</td>
                <td style={{color: '#0056ff'}}>{item.charges}</td>
                <td>{item.itemRate}</td>
                <td>{item.amt}</td>
                <td style={{color: '#0056ff'}}>{item.cod}</td>
                <td>{item.netPayable}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Net Payable: {data.netPayable}</h3>
        <h3>Previous: {data.previous}</h3>
        <h3>Net Balance: {data.netBalance}</h3>
        <h3>3PL Valley</h3>
      </div>
    </div>
  );
});

export default Payout;