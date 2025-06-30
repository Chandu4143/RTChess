document.addEventListener('DOMContentLoaded', () => {
    // Custom Select Logic
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(select => {
        const trigger = select.querySelector('.custom-select-trigger');
        const options = select.querySelectorAll('.custom-option');
        const triggerSpan = trigger.querySelector('span');

        trigger.addEventListener('click', () => {
            select.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Update the hidden select value
                const hiddenSelectId = select.id.replace('-select', '');
                const hiddenSelect = document.getElementById(hiddenSelectId);
                if (hiddenSelect) {
                    hiddenSelect.value = option.dataset.value;
                }

                // Update the trigger text
                triggerSpan.textContent = option.textContent;
                
                // Update selected class
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // Close the dropdown
                select.classList.remove('open');
            });
        });
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', e => {
        customSelects.forEach(select => {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });
});
