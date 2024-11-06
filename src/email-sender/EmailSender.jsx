import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './EmailSender.css'; // Import the CSS file

const EmailSender = () => {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!emails) newErrors.emails = 'Please enter emails or upload a CSV file';
    if (!subject) newErrors.subject = 'Please enter the subject of the email';
    if (!mailContent) newErrors.mailContent = 'Please enter the email content';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle CSV file upload and parse
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const emailList = result.data.flat().filter(email => email.includes('@'));
          setEmails(emailList.join(', '));
          setErrors((prevErrors) => ({ ...prevErrors, emails: '' })); // Clear email error if any
        },
        header: false,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v2/email/sendMails`, {
        listOfEmails: emails,
        mailSubject: subject,
        mailContent,
      });
      setResponse(res.data.message);
    } catch (error) {
      console.error(error);
      setResponse(error.response?.data?.message || 'Error sending emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="header">Email Sender</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="field-container">
          <label className="label">Comma-separated Emails:</label>
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="Enter emails separated by commas"
            className="input"
          />
          {errors.emails && <p className="error-text">{errors.emails}</p>}
        </div>
        <div className="field-container">
          <label className="label">Upload CSV with Emails:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="input"
          />
        </div>
        <div className="field-container">
          <label className="label">Mail Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject of the email"
            className="input"
          />
          {errors.subject && <p className="error-text">{errors.subject}</p>}
        </div>
        <div className="field-container">
          <label className="label">Mail Content:</label>
          <textarea
            value={mailContent}
            onChange={(e) => setMailContent(e.target.value)}
            placeholder="Type the email content here"
            className="textarea"
          />
          {errors.mailContent && <p className="error-text">{errors.mailContent}</p>}
        </div>
        <button
          type="submit"
          className="button"
          disabled={loading} // Disable button only while loading
        >
          Send Emails
        </button>
      </form>

      {loading && <p className="loading">Sending emails...</p>}
      {response && !loading && <p className="response">{response}</p>}
    </div>
  );
};

export default EmailSender;
