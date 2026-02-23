document.addEventListener('DOMContentLoaded', () => {
    // --- НАСТРОЙКИ ---
    const SYMBOLS = [
        { name: 'civic',   src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300', value: 10 },
        { name: 'skyline', src: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300', value: 20 },
        { name: 'supra',   src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300', value: 30 },
        { name: 'rx7',     src: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=300', value: 40 },
        { name: 'impreza', src: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=300', value: 50 },
        { name: 'evo',     src: 'https://images.unsplash.com/photo-1583121274602-89a6c0a3a0d3?w=300', value: 60 },
        { name: 'wild',    src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300', value: 0, isWild: true },
        { name: 'scatter', src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300', value: 0, isScatter: true }
    ];

    let balance = 1000;
    let bet = 10;
    let isSpinning = false;
    let autoSpin = false;

    const balanceEl     = document.getElementById('balance');
    const betEl         = document.getElementById('bet-value');
    const spinBtn       = document.getElementById('spin-btn');
    const autoBtn       = document.getElementById('auto-btn');
    const betMinus      = document.getElementById('bet-minus');
    const betPlus       = document.getElementById('bet-plus');
    const payoutBtn     = document.getElementById('payout-btn');
    const modal         = document.getElementById('modal');
    const closeModal    = document.querySelector('.close-modal');

    const reels = Array.from({ length: 5 }, (_, i) => document.getElementById(`reel-${i}`));

    // --- ФУНКЦИИ UI ---
    function updateUI() {
        balanceEl.textContent = balance;
        betEl.textContent = bet;
        spinBtn.disabled = isSpinning || balance < bet;
    }

    // --- ГЕНЕРАЦИЯ РЕЗУЛЬТАТА ---
    function getRandomSymbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }

    function spinReels() {
        if (isSpinning || balance < bet) return;

        isSpinning = true;
        balance -= bet;
        updateUI();

        reels.forEach(reel => {
            reel.innerHTML = '';
            const strip = Array(30).fill(0).map(() => getRandomSymbol()); // длинная лента для анимации
            const final = Array(3).fill(0).map(() => getRandomSymbol());

            strip.push(...final);

            const inner = document.createElement('div');
            inner.className = 'inner-reel';

            strip.forEach(sym => {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.style.backgroundImage = `url(${sym.src})`;
                inner.appendChild(div);
            });

            reel.appendChild(inner);

            // Запуск анимации
            setTimeout(() => {
                inner.style.transform = `translateY(-${(strip.length - 3) * 140}px)`;
            }, 100);
        });

        // Завершение спина через ~3 секунды
        setTimeout(() => {
            isSpinning = false;
            updateUI();
            if (autoSpin) setTimeout(spinReels, 800);
        }, 3200);
    }

    // --- СОБЫТИЯ ---
    spinBtn.addEventListener('click', spinReels);

    autoBtn.addEventListener('click', () => {
        autoSpin = !autoSpin;
        autoBtn.textContent = autoSpin ? 'СТОП АВТО' : 'АВТО-СПИН';
        if (autoSpin && !isSpinning) spinReels();
    });

    betMinus.addEventListener('click', () => { if (bet > 1) bet = Math.max(1, bet - 5); updateUI(); });
    betPlus.addEventListener('click',  () => { if (bet < 200) bet += 5; updateUI(); });

    payoutBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    updateUI();
});