

function componentsheader() {
    fetch("../components/header.html")
        .then(response => response.text())
        .then(data => document.getElementById("header-placeholder").innerHTML = data)
        .catch(error => console.error("Error loading header:", error));

        fetch("../components/Footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("Footer-placeholder").innerHTML = data)
        .catch(error => console.error("Error loading Footer:", error));
};

// Load header when the page loads
window.onload = componentsheader;


AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true
});

// Initialize Datepicker
$(document).ready(function() {
    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true,
        todayHighlight: true
    });
});

  
