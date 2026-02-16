export const convertDate = (pdfDate) => {
    const newDate = new Date(pdfDate);
    return newDate.toLocaleDateString();
  };

