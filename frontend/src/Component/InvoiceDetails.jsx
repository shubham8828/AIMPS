import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas"; // Import html2canvas
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import toast from "react-hot-toast";

const InvoiceDetails = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);
  const [user, setUser] = useState();
  const [isEditing, setIsEditing] = useState(false); // Track if we are in edit mode
  const [editableProducts, setEditableProducts] = useState(data.products);
  const [paymentStatus, setPaymentStatus] = useState();
  const logo = localStorage.getItem("image");

  const navigate = useNavigate();
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  // Fetch user data
  useEffect(() => {
    const token=localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:4000/api/user", {},{headers});
        const invoiceId = data.invoiceId;
        const payment = await axios.post(
          "http://localhost:4000/api/getPaymentData",
          { invoiceId },{headers}
        );
        setPaymentStatus(payment.data); // 'Successful'
        // console.log(payment.data)
        setUser(response.data.user);
      } catch (error) {
        alert("Internal Server Error");
      }
    };

    fetchUserData();
  }, []);

  // Function to generate PDF from HTML content using html2canvas
  const generatePDF = (customerName) => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => (button.style.display = "none"));

    const input = document.querySelector(".invoice-container");
    input.classList.add("no-border");

    // Save original styles
    const originalStyle = input.style.cssText;

    // Temporarily adjust styles for proper rendering
    input.style.width = "80%";
    input.style.height = "auto";

    // Use html2canvas to capture the full content
    html2canvas(input, {
      useCORS: true, // Allow cross-origin resource sharing
      scrollX: 0,
      scrollY: 0,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    })
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4", // A4 size (595.28 x 841.89 pts)
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scaleFactor = pdfWidth / canvasWidth; // Scale content to fit PDF width
        const scaledCanvasHeight = canvasHeight * scaleFactor;

        if (scaledCanvasHeight > pdfHeight) {
          // Handle multi-page PDFs
          let position = 0;

          while (position < canvasHeight) {
            const canvasSection = canvas
              .getContext("2d")
              .getImageData(
                0,
                position,
                canvas.width,
                Math.min(canvas.height - position, pdfHeight / scaleFactor)
              );

            const sectionCanvas = document.createElement("canvas");
            sectionCanvas.width = canvas.width;
            sectionCanvas.height = canvasSection.height;

            const sectionCtx = sectionCanvas.getContext("2d");
            sectionCtx.putImageData(canvasSection, 0, 0);

            const sectionImageData = sectionCanvas.toDataURL("image/png", 1.0);
            pdf.addImage(sectionImageData, "PNG", 0, 0, pdfWidth, pdfHeight);

            position += pdfHeight / scaleFactor;
            if (position < canvasHeight) pdf.addPage();
          }
        } else {
          // Single-page content
          pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, scaledCanvasHeight);
        }

        pdf.save(`${customerName}_invoice.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF.");
      })
      .finally(() => {
        input.style.cssText = originalStyle;
        input.classList.remove("no-border");
        buttons.forEach((button) => (button.style.display = "inline-block"));
      });
  };

  // Function to handle product changes
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index][field] = value;
    setEditableProducts(updatedProducts);
  };

  // Function to toggle edit mode and handle data collection
  const toggleEditMode = (editMode) => {
    if (!editMode) {
      // Collect all the updated data
      const updatedInvoiceData = {
        id: data._id,
        to: data.to,
        address: data.address,
        phone: data.phone,
        date: data.date,
        products: editableProducts,
        total: editableProducts.reduce(
          (sum, item) =>
            sum + parseFloat(item.price) * parseFloat(item.quantity),
          0
        ),
      };

      // Log the updated object to the console
      // console.log("Updated Invoice Data:", updatedInvoiceData);

      const token=localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      axios
        .put("http://localhost:4000/api/updateInvoice",updatedInvoiceData,{headers})
        .then((res) => {
          toast.success(res.data.message, { position: "top-center" });
          // console.log(res.data.invoice)
          setData(res.data.invoice);
        })
        .catch((error) => {
          toast.error(res.data.message, { position: "top-center" });
        });
    }
    setIsEditing(editMode);
  };

  const handlePayNow = () => {
    navigate("/payments", { state: data });
  };

  return (
    <div className="invoice-container" id="invoice-content">
      {/* Header and User Details */}
      <div className="header-conatainer">
        <img src={logo} alt="company logo" />
        {user && (
          <div className="user-detail-container">
            <span className="userName">{user.shopname}</span> <br />
            <span className="address">
              {user.address.localArea +
                " " +
                user.address.city +
                " " +
                user.address.state +
                " " +
                user.address.country +
                " " +
                user.address.pin}
            </span>{" "}
            <br />
            <span className="contact">
              {user.email} || +91 {user.phone}
            </span>{" "}
            <br />
          </div>
        )}
      </div>

      {/* Main Invoice Details */}
      <div className="main-detail-container">
        <div className="detail-container">
          <h4>Bill to: </h4>
          {isEditing ? (
            <>
              <span className="customer">
                Name:
                <input
                  type="text"
                  value={data.to}
                  onChange={(e) => setData({ ...data, to: e.target.value })}
                />
              </span>
              <br />
              <span className="customer">
                Address:
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) =>
                    setData({ ...data, address: e.target.value })
                  }
                />
              </span>
              <br />
              <span className="customer">
                Phone No: +91
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </span>
            </>
          ) : (
            <>
              <span className="customer">Name: {data.to}</span> <br />
              <span className="customer">Address: {data.address}</span> <br />
              <span className="customer">Phone No: +91 {data.phone}</span>
            </>
          )}
        </div>

        <div className="detail-container">
          <p>Invoice No.: {data.invoiceId} </p>
          <p>Date: {formatDate(data.date)}</p>
        </div>
      </div>

      {/* Invoice Content to be Captured for PDF */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {editableProducts.map((item, index) => {
            const srNo = index + 1;
            const price = parseFloat(item.price);
            const quantity = parseFloat(item.quantity);
            const total = price * quantity;
            return (
              <tr key={index}>
                <td>{srNo}</td>
                <td className="nameCap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleProductChange(index, "name", e.target.value)
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleProductChange(index, "price", e.target.value)
                      }
                    />
                  ) : (
                    price
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
                      }
                    />
                  ) : (
                    quantity
                  )}
                </td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} style={{ textAlign: "center" }}>
              Total
            </td>
            <td>{data.total}</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer */}
      <div className="invoice-main-footer">
        <p>
          <b>Payment Terms:</b> Payment due within 30 days of invoice date.
        </p>
        <p>
          <b>Late Fees:</b> A late fee of 1.5% per month will apply for overdue
          balances.
        </p>
        <p>
          <b>Contact:</b> For questions regarding this invoice, please contact
          us at{" "}
          <a href="mailto:aimps24x7@gmail.com" style={{ color: "blue" }}>
            aimps24x7@gmail.com
          </a>
        </p>
        <p>Thank you for your business! We appreciate your prompt payment.</p>
      </div>

      {/* Actions */}
      <div className="actions-container">
        <button onClick={() => toggleEditMode(!isEditing)}>
          {isEditing ? "Save Changes" : "Edit Invoice"}
        </button>
        {paymentStatus !== null && (
          <button onClick={() => generatePDF(data.to)}>Download PDF</button>
        )}

        {/* <button>Share via Email</button>
        <button>Share via WhatsApp</button> */}

        {paymentStatus === null && (
          <button onClick={handlePayNow}>Pay Now</button>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
