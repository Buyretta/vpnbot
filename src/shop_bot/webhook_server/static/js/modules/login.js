// Login Page Module
// Canvas анимация, переключатель пароля, запоминание логина

export function initializeLoginPage() {
    const canvas = document.getElementById('scene');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let t = 0;

    // Блокируем копирование/сохранение через UI только на странице логина
    const prevent = (e) => e.preventDefault();
    document.addEventListener('contextmenu', prevent, { passive: false });
    canvas.addEventListener('dragstart', prevent, { passive: false });
    canvas.addEventListener('mousedown', prevent, { passive: false });
    document.addEventListener('copy', prevent, { passive: false });

    function resize() {
        DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const { innerWidth: w, innerHeight: h } = window;
        canvas.width = Math.max(1, Math.floor(w * DPR));
        canvas.height = Math.max(1, Math.floor(h * DPR));
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function draw() {
        const W = Math.max(1, Math.floor(canvas.width / DPR));
        const H = Math.max(1, Math.floor(canvas.height / DPR));
        ctx.clearRect(0, 0, W, H);

        const L = Math.hypot(W, H);
        const nx = H / L, ny = W / L;

        const lines = 120;
        const baseBand = H * 0.45 * 1.5 * 1.2;
        const bandPulse = 1 + 0.06 * Math.sin(t * 0.07);

        for (let i = 0; i < lines; i++) {
            const f = i / (lines - 1);
            const bias = f - 0.5;
            const sideFactor = 0.6 + 0.4 * f;
            const cornerFactor = 1 - 0.5 * (1 - f);
            const offset = bias * baseBand * bandPulse * sideFactor * cornerFactor;

            const lw = Math.max(0.55, 1.2 - f * 0.5);
            const alpha = Math.max(0.06, 0.32 * (0.95 - Math.abs(bias) * 0.75));
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.strokeStyle = `rgba(88, 125, 255, ${alpha})`;

            const twistStrength = 0.12 * (1 + 0.3 * Math.sin(t * 0.2 + i * 0.15));

            for (let s = -0.2, first = true; s <= 1.2; s += 0.01) {
                const sd = s;
                const x0 = sd * W;
                const y0 = H - sd * H;

                const disp = Math.sin(t * 0.1 + i * 0.05) * (baseBand * 0.04);
                const twist = Math.sin(sd * Math.PI + t * 0.12 + i * 0.03) * twistStrength * baseBand;

                const x = x0 + (nx * disp) + Math.cos(sd * Math.PI) * twist;
                const y = y0 + offset + (ny * disp) + Math.sin(sd * Math.PI) * twist;

                if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    function animate() { 
        t += 0.016; 
        draw(); 
        requestAnimationFrame(animate); 
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    ctx.fillStyle = 'rgba(88,125,255,0.08)';
    ctx.fillRect(0, 0, Math.max(1, Math.floor(canvas.width / DPR)), Math.max(1, Math.floor(canvas.height / DPR)));
    animate();

    // Переключатель видимости пароля на странице логина
    const btn = document.getElementById('toggle-login-pass');
    const input = document.getElementById('password');
    if (btn && input) {
        const eye = document.getElementById('icon-eye');
        const eyeOff = document.getElementById('icon-eye-off');
        btn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                btn.setAttribute('aria-label', 'Скрыть пароль');
                btn.title = 'Скрыть пароль';
                if (eye) eye.style.display = '';
                if (eyeOff) eyeOff.style.display = 'none';
            } else {
                input.type = 'password';
                btn.setAttribute('aria-label', 'Показать пароль');
                btn.title = 'Показать пароль';
                if (eye) eye.style.display = 'none';
                if (eyeOff) eyeOff.style.display = '';
            }
        });
    }

    // Запомнить логин (username) локально
    const u = document.getElementById('username');
    const r = document.getElementById('remember_me');
    if (u && r) {
        try {
            const saved = localStorage.getItem('login_username');
            if (saved) { 
                u.value = saved; 
                r.checked = true; 
            }
        } catch (_) {}
        
        u.form?.addEventListener('submit', () => {
            try {
                if (r.checked) localStorage.setItem('login_username', u.value || '');
                else localStorage.removeItem('login_username');
            } catch (_) { }
        });
    }
}
