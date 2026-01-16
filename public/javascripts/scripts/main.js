document.addEventListener('DOMContentLoaded', () => {
    // GET CLUB DATA FROM SERVER
    // Gets data from window.clubsData (set in index.pug)
    const clubs = window.clubsData || [];

    // If no data, something went wrong
    if (clubs.length === 0) {
        console.error('No club data found!');
        return;
    }

    // SELECT ELEMENTS
    const cards = document.querySelectorAll('.club-card');
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('club-modal');
    const closeBtn = document.getElementById('close-btn');

    // Modal content elements
    const modalName = document.getElementById('modal-name');
    const modalMeeting = document.getElementById('modal-meeting');
    const modalLocation = document.getElementById('modal-location');
    const modalShortDesc = document.getElementById('modal-shortdesc');
    const modalCommitment = document.getElementById('modal-commitment');
    const modalAdvisor = document.getElementById('modal-advisor');
    const modalOfficers = document.getElementById('modal-officers');
    const modalBanner = document.getElementById('modal-banner');
    const modalMore = document.getElementById('modal-more');

    // FUNCTION TO CLOSE MODAL
    // FIXED: Created a reusable function for closing
    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    // OPEN MODAL
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Get the club ID from the card's data attribute
            const clubId = card.dataset.id;

            // Find the matching club in our data
            const club = clubs.find(c => c.id === clubId);

            // If club not found, don't open modal
            if (!club) {
                console.error(`Club with id "${clubId}" not found`);
                return;
            }

            // Populate modal with club information
            modalName.textContent = club.name;
            modalMeeting.textContent = `Meeting: ${club.meeting}`;
            modalLocation.textContent = `Location: ${club.location || 'TBD'}`;
            modalShortDesc.textContent = club.shortDesc;
            modalCommitment.textContent = `Commitment: ${club.commitment || 'TBD'}`;
            modalAdvisor.textContent = `Advisor: ${club.advisor || 'TBD'}`;
            modalOfficers.textContent = `Officers: ${club.officers || 'TBD'}`;

            // Set banner image (with fallback)
            modalBanner.src = club.banner || '/images/banner-placeholder.jpg';

            // FIXED: Link to the individual club page properly
            modalMore.href = `/clubs/${club.id}`;

            // Show modal and overlay
            overlay.style.display = 'block';
            modal.style.display = 'block';
        });
    });

    // CLOSE MODAL
    // Close when clicking the X button
    closeBtn.addEventListener('click', closeModal);

    // Close when clicking outside the modal (on the overlay)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // FIXED: Close modal with Escape key - added to document, not just when modal visible
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Only close if modal is currently visible
            if (modal.style.display === 'block') {
                closeModal();
            }
        }
    });
});