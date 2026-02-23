document.addEventListener('DOMContentLoaded', () => {
    // ────────────────────────────────────────────────
    //  КОНФИГ
    // ────────────────────────────────────────────────
    const SYMBOLS = [
        { name: 'civic',   src: 'https://s0.rbk.ru/v6_top_pics/media/img/8/37/755335712435378.jpg', value: 8  },
        { name: 'skyline', src: 'https://japan-motor.com/storage/app/uploads/public/609/d80/660/609d806607d6b060370386.jpg', value: 12 },
        { name: 'supra',   src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Anthro_vixen_colored.jpg/250px-Anthro_vixen_colored.jpg', value: 20 },
        { name: 'rx7',     src: 'https://i.redd.it/x8c9jqsaucx91.jpg', value: 30 },
        { name: 'impreza', src: 'https://i.ebayimg.com/00/s/MTU0NFgxMTU4/z/TGkAAOSwRjVjfgUs/$_57.JPG?set_id=880000500F', value: 45 },
        { name: 'evo',     src: 'https://static0.hotcarsimages.com/wordpress/wp-content/uploads/2021/08/s2k.jpg?w=1200&h=628&fit=crop', value: 60 },
        { name: 'silvia',  src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTXYCLTgqjuYsBUq629jPvqSMBvOGBZSrXSw&s', value: 80 },
        { name: 'wild',    src: 'https://images.unsplash.com/photo-1581092160607-8a6a646d3b15?auto=format&fit=crop&q=80&w=800', value: 0,  wild: true   },
        { name: 'scatter', src: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', value: 0,  scatter: true }
    ];

    const REEL_COUNT = 5;
    const VISIBLE_ROWS = 3;
    const SYMBOL_HEIGHT = 160;
    const SPIN_DURATION = 3200;

    let balance = 1000;
    let bet = 10;
    let isSpinning = false;
    let autoMode = false;

    // Элементы
    const balanceEl   = document.getElementById('balance');
    const betEl       = document.getElementById('bet');
    const spinBtn     = document.getElementById('spin');
    const autoBtn     = document.getElementById('auto');
    const minusBtn    = document.getElementById('bet-minus');
    const plusBtn     = document.getElementById('bet-plus');
    const infoBtn     = document.getElementById('payout-table-btn');
    const modal       = document.getElementById('modal');
    const closeModal  = document.querySelector('.close-modal');
    const payoutDiv   = document.getElementById('payout-content');

    const depositBtn = document.getElementById('deposit-btn');
    const depositModal = document.getElementById('deposit-modal');
    const depositTurbo = document.getElementById('deposit-turbo');
    const depositNormal = document.getElementById('deposit-normal');
    const depositTroll = document.getElementById('deposit-troll');

    const reels = Array.from({length: REEL_COUNT}, (_, i) => document.getElementById(`reel${i}`));

    // ────────────────────────────────────────────────
    //  ТАБЛИЦА ВЫПЛАТ
    // ────────────────────────────────────────────────
    function generatePayoutTable() {
        let html = '<table><thead><tr><th>Символ</th><th>3×</th><th>4×</th><th>5×</th></tr></thead><tbody>';

        SYMBOLS.forEach(s => {
            if (s.wild || s.scatter) return;
            const payout3 = s.value * 3;
            const payout4 = s.value * 5;
            const payout5 = s.value * 10;
            html += `
                <tr>
                    <td><div class="symbol-preview" style="background-image:url(${s.src})"></div></td>
                    <td>${payout3}</td>
                    <td>${payout4}</td>
                    <td>${payout5}</td>
                </tr>`;
        });

        html += `
            <tr>
                <td>Scatter (флаг) в любом месте</td>
                <td>15×</td>
                <td>30×</td>
                <td>100×</td>
            </tr>
            <tr>
                <td>Wild (турбо) заменяет любой</td>
                <td colspan="3">×2 к выигрышу линии</td>
            </tr>`;

        html += '</tbody></table>';
        payoutDiv.innerHTML = html;
    }

    // ────────────────────────────────────────────────
    //  UI
    // ────────────────────────────────────────────────
    function updateUI() {
        balanceEl.textContent = Math.floor(balance);
        betEl.textContent = bet;
        spinBtn.disabled = isSpinning || balance < bet;
        autoBtn.textContent = autoMode ? 'STOP AUTO' : 'AUTO';
    }

    // ────────────────────────────────────────────────
    //  СПИН
    // ────────────────────────────────────────────────
    function spin() {
        if (isSpinning || balance < bet) return;

        isSpinning = true;
        balance -= bet;
        updateUI();

        const finalSymbols = Array(REEL_COUNT).fill().map(() =>
            Array(VISIBLE_ROWS).fill().map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
        );

        reels.forEach((reel, i) => {
            reel.innerHTML = '';

            const strip = [];
            // Длинная лента для красивого спина
            for (let j = 0; j < 25; j++) {
                strip.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
            }
            strip.push(...finalSymbols[i]);

            const inner = document.createElement('div');
            inner.className = 'inner';

            strip.forEach(sym => {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.style.backgroundImage = `url(${sym.src})`;
                inner.appendChild(div);
            });

            reel.appendChild(inner);

            setTimeout(() => {
                const shift = (strip.length - VISIBLE_ROWS) * SYMBOL_HEIGHT;
                inner.style.transform = `translateY(-${shift}px)`;
            }, 50 + i * 180);
        });

        setTimeout(() => {
            isSpinning = false;
            updateUI();
            if (autoMode && balance >= bet) {
                setTimeout(spin, 900);
            }
        }, SPIN_DURATION + 400);
    }

    // ────────────────────────────────────────────────
    //  СОБЫТИЯ
    // ────────────────────────────────────────────────
    spinBtn.addEventListener('click', spin);

    autoBtn.addEventListener('click', () => {
        autoMode = !autoMode;
        updateUI();
        if (autoMode && !isSpinning && balance >= bet) spin();
    });

    minusBtn.addEventListener('click', () => {
        if (bet > 5) bet -= 5;
        updateUI();
    });

    plusBtn.addEventListener('click', () => {
        if (bet < 200) bet += 5;
        updateUI();
    });

    infoBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Логика для шуточного меню привязки карты
    depositBtn.addEventListener('click', () => depositModal.classList.remove('hidden'));
    depositModal.addEventListener('click', e => {
        if (e.target === depositModal) depositModal.classList.add('hidden');
    });

    // Шуточное пополнение (виртуальное)
    depositTurbo.addEventListener('click', () => {
        balance += 1000;
        updateUI();
        depositModal.classList.add('hidden');
        alert('Турбо-привязка удалась! +1000 кредитов. Вуууушшш! 🔥');
    });

    depositNormal.addEventListener('click', () => {
        balance += 500;
        updateUI();
        depositModal.classList.add('hidden');
        alert('Обычная привязка. +500 кредитов. Без фанатизма.');
    });

    depositTroll.addEventListener('click', () => {
        balance += 100;
        updateUI();
        depositModal.classList.add('hidden');
        alert('Мазохист-режим активирован. +100 кредитов. Но карта заблокирована на 24 часа... шутка!');
    });

    // Старт
    generatePayoutTable();
    updateUI();
});