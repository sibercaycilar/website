document.addEventListener('DOMContentLoaded', () => {
    const contactOptions = document.querySelectorAll('.contact-option');
    const contentPanels = document.querySelectorAll('.content-panel');

    if (contactOptions.length > 0) {
        contactOptions[0].classList.add('active-option');
        const initialTargetId = contactOptions[0].dataset.target;
        document.getElementById(initialTargetId).classList.add('active');
    }

    contactOptions.forEach(option => {
        option.addEventListener('click', () => {
            contactOptions.forEach(opt => opt.classList.remove('active-option'));
            option.classList.add('active-option');

            contentPanels.forEach(panel => panel.classList.remove('active'));

            const targetId = option.dataset.target;
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
});
