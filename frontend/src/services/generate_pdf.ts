export const generateEtiquette = (orderId: string) => {
  // Create a new form element
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${import.meta.env.VITE_BASE_URL}/generate-pdf/etiquette-commande`; // Replace with your API endpoint
  form.target = "_blank"; // Open in a new window

  // Create a hidden input field for orderId
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "orderId";
  input.value = orderId;
  //"c2d63d98-d9cb-4eff-811f-89e69a095a08";

  // Append the input field to the form
  form.appendChild(input);

  // Append the form to the document body
  document.body.appendChild(form);

  // Submit the form
  form.submit();

  // Remove the form from the document body
  document.body.removeChild(form);
};
export const generateProviderFacture = (id: string, from: string, to: string, invoiceType: number) => {
  console.log("from", from);
  console.log("to", to);
  // Create a new form element
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${import.meta.env.VITE_BASE_URL}/user/generate-provider-invoice`; // Replace with your API endpoint
  form.target = "_blank"; // Open in a new window

  // Create a hidden input id field for orderId
  const inputId = document.createElement("input");
  inputId.type = "hidden";
  inputId.name = "id";
  inputId.value = id;

  // Append the input field to the form
  form.appendChild(inputId);

  // Create a hidden inputFromDate field for orderId
  const inputFromDate = document.createElement("input");
  inputFromDate.type = "hidden";
  inputFromDate.name = "from";
  inputFromDate.value = from;

  // Append the input field to the form
  form.appendChild(inputFromDate);

  // Create a hidden inputToDate field for orderId
  const inputToDate = document.createElement("input");
  inputToDate.type = "hidden";
  inputToDate.name = "to";
  inputToDate.value = to;
  //"c2d63d98-d9cb-4eff-811f-89e69a095a08";

  // Append the input field to the form
  form.appendChild(inputToDate);

  // Create a hidden input id field for invoiceType
  const inputInvoiceType = document.createElement("input");
  inputInvoiceType.type = "hidden";
  inputInvoiceType.name = "invoiceType";
  inputInvoiceType.value = invoiceType?.toString();

  // Append the invoiceType field to the form
  form.appendChild(inputInvoiceType);

  // Append the form to the document body
  document.body.appendChild(form);

  // Submit the form
  form.submit();

  // Remove the form from the document body
  document.body.removeChild(form);
};
