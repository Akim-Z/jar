document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const modalWindow = document.getElementById('modalWindow');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const container = document.getElementById('canvas-container');

    const hearts = [
        document.getElementById('heart1'),
        document.getElementById('heart2'),
        document.getElementById('heart3'),
        document.getElementById('heart4')
    ];

    const messages = [
        {
            title: "Ты невероятная красавица ❤️",
            text: "Каждый раз глядя на тебя, у меня захватывает дух от твоей красоты. Просто знай, что нет «особенных дней», ты непревзойденна каждый день.",
            emojis: ["💖", "💕", "❤️", "✨"]
        },
        {
            title: "Особенная 💙",
            text: "Даже обычные дни становятся более наполненными с тобой. Ведь твое присутствие имеет для меня значение.",
            emojis: ["🦋", "💙", "🌊", "❄️"]
        },
        {
            title: "Моё солнышко ☀️",
            text: "Ты, твой смех, твоя улыбка… Ты просто сияешь. Спасибо тебе за то, что делаешь каждый мой день ярче!",
            emojis: ["🌻", "💛", "🧡", "☀️"]
        },
        {
            title: "Ты космическая 💜",
            text: "Каждый разговор с тобой затягивает словно черная дыра. Ты невероятно интересная, и с тобой хочется говорить обо всем. Даже до 4 утра. Даже когда вставать в 8.",
            emojis: ["💜", "🌌", "🔮", "✨"]
        },
        {
            title: "Искренняя 💚",
            text: "Хотя, может, ты и не умеешь делать комплименты. Твой смех и твое лицо не могут обмануть. И это уже прекрасный комплимент.",
            emojis: ["🍀", "💚", "🌱", "🌿"]
        },
        {
            title: "Муза 🎨",
            text: "Ты вдохновляешь меня двигаться дальше и достигать целей. С тобой хочется учить что-то новое, открывать этот мир снова и учиться, учиться просто жить.",
            emojis: ["🎨", "💖", "✨", "🖌️"]
        },
        {
            title: "Родная душа 😊",
            text: "Мне правда легко с тобой, я в восторге, что тебе не нужно лишний раз объяснять, почему я выбираю жить так, а не иначе. Твои ценности во многом резонируют с моими, и это делает все еще более особенным.",
            emojis: ["😊", "💛", "🎶", "🌟"]
        },
        {
            title: "Любимка 💖",
            text: "Все предыдущие слова едва ли могут описать всё по-настоящему, это лишь маленькая попытка сказать тебе, что ты для меня очень важна. Обнимаю :)",
            emojis: ["💍", "💖", "🌹", "✨"]
        }
    ];

    let currentIndex = 0;
    let isModalOpen = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    const jarGroup = new THREE.Group();
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });

    const jarMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 32), glassMaterial);
    const bottomMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.15, 0.2, 32), glassMaterial);
    bottomMesh.position.y = -1.5;
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32), glassMaterial);
    neckMesh.position.y = 1.6;
    jarGroup.add(jarMesh, bottomMesh, neckMesh);

    const corkMaterial = new THREE.MeshStandardMaterial({ color: 0xc59f8a, roughness: 0.8 });
    const corkMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.3, 32), corkMaterial);
    corkMesh.position.y = 1.85;
    jarGroup.add(corkMesh);

    const envelopeGroup = new THREE.Group();
    const envelope = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.05), new THREE.MeshStandardMaterial({ color: 0xfcf0f0 }));
    envelopeGroup.add(envelope);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.3, -0.3, 0.3, -0.3, 0);
    heartShape.bezierCurveTo(-0.3, -0.3, 0, -0.5, 0, -0.5);
    heartShape.bezierCurveTo(0, -0.5, 0.3, -0.3, 0.3, 0);
    heartShape.bezierCurveTo(0.3, 0.3, 0, 0.3, 0, 0);

    const heartGeom = new THREE.ShapeGeometry(heartShape);
    const heartMesh = new THREE.Mesh(heartGeom, new THREE.MeshBasicMaterial({ color: 0xff4b68 }));
    heartMesh.scale.set(0.3, 0.3, 0.3);
    heartMesh.position.set(0, 0.1, 0.03);
    envelopeGroup.add(heartMesh);
    envelopeGroup.position.y = -0.5;
    envelopeGroup.rotation.y = Math.PI / 4;
    jarGroup.add(envelopeGroup);

    const floatingHeartsGroup = new THREE.Group();
    const floatingHeartMat = new THREE.MeshBasicMaterial({ color: 0xff4b68, transparent: true, opacity: 0.35, side: THREE.DoubleSide });

    for (let i = 0; i < 5; i++) {
        const h = new THREE.Mesh(heartGeom, floatingHeartMat);
        const scale = 0.1 + Math.random() * 0.1;
        h.scale.set(scale, scale, scale);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.8;
        h.position.set(Math.cos(angle) * radius, -1.0 + Math.random() * 2.0, Math.sin(angle) * radius);
        h.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        h.userData = {
            speedY: 0.002 + Math.random() * 0.003,
            speedRotX: (Math.random() - 0.5) * 0.02,
            speedRotY: (Math.random() - 0.5) * 0.02
        };
        floatingHeartsGroup.add(h);
    }
    jarGroup.add(floatingHeartsGroup);
    jarGroup.position.y = -0.2;
    scene.add(jarGroup);

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        if (!isModalOpen) {
            time += 0.03;
            envelopeGroup.position.y = -0.5 + Math.sin(time) * 0.1;
            floatingHeartsGroup.children.forEach(h => {
                h.position.y += h.userData.speedY;
                h.rotation.x += h.userData.speedRotX;
                h.rotation.y += h.userData.speedRotY;
                if (h.position.y > 1.2) h.position.y = -1.2;
            });
            jarGroup.rotation.y += 0.005;
            jarGroup.rotation.x = Math.sin(time * 0.5) * 0.05;
        }
        renderer.render(scene, camera);
    }
    animate();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        if (isModalOpen) return;
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        if (raycaster.intersectObjects(jarGroup.children, true).length > 0) openModal();
    }

    window.addEventListener('click', onMouseClick);
    window.addEventListener('touchstart', onMouseClick, { passive: false });

    function openModal() {
        isModalOpen = true;
        gsap.to(jarGroup.scale, { x: 0, y: 0, z: 0, duration: 0.6, ease: "back.in(1.7)" });
        gsap.to(jarGroup.position, { y: -2, duration: 0.6, ease: "power2.in" });

        const msg = messages[currentIndex];
        modalTitle.textContent = msg.title;
        modalText.textContent = msg.text;
        hearts.forEach((h, i) => { if (msg.emojis[i]) h.textContent = msg.emojis[i]; });
        modalWindow.className = `modal theme-${currentIndex}`;

        setTimeout(() => modalOverlay.classList.add('active'), 400);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        currentIndex = (currentIndex + 1) % messages.length;
        setTimeout(() => {
            isModalOpen = false;
            gsap.to(jarGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.7)" });
            gsap.to(jarGroup.position, { y: -0.2, duration: 0.8, ease: "power2.out" });
        }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
