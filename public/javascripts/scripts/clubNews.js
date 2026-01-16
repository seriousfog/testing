document.addEventListener('DOMContentLoaded', function () {
    const formNews = document.getElementById('formNews');
    const formShow = document.getElementById('formShow');
    const formHide = document.getElementById('formHide');

    const formNews2 = document.getElementById('formNews2');
    const formShow2 = document.getElementById('formShow2');
    const formHide2 = document.getElementById('formHide2');

    // Function to open the popup
    function openForm() {
        formNews.style.display = 'block';
        formShow.style.display = 'none';
        formHide.style.display = 'block';
    }

    // Function to close the popup
    function closeFormFunc() {
        formNews.style.display = 'none';
        formShow.style.display = 'block';
        formHide.style.display = 'none';
    }
    formShow.addEventListener('click', openForm);


    // Close the popup when the close button is clicked
    formHide.addEventListener('click', closeFormFunc);



    // Function to open the popup
    function openForm2() {
        formNews2.style.display = 'block';
        formShow2.style.display = 'none';
        formHide2.style.display = 'block';
    }

    // Function to close the popup
    function closeFormFunc2() {
        formNews2.style.display = 'none';
        formShow2.style.display = 'block';
        formHide2.style.display = 'none';
    }
    formShow2.addEventListener('click', openForm2);


    // Close the popup when the close button is clicked
    formHide2.addEventListener('click', closeFormFunc2);

})