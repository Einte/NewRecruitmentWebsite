// onclick event to listen click then display alert message
const courseLink = document.getElementById('course-link');


courseLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    alert('Good for you, you want to learn more!');
    // Optionally, you can redirect to the courses page after the alert
    // window.location.href = 'courses.html';
    window.location.href = "/courses/courses.html";
});
//-------------------------------------------------------------------------------
