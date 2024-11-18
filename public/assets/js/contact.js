document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    fetch('/feedback', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        alert(data.message); 
        document.getElementById('contact-form').reset();
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      alert('An error occurred. Please try again later.');
      console.error(error);
    });
  });