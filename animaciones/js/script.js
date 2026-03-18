const { createApp, ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } = Vue;

createApp({
    setup() {
        /* ============================================
           ESTADO REACTIVO PRINCIPAL
           ============================================ */

        // Navegación
        const currentSection = ref('estilos');
        const mobileMenuOpen = ref(false);
        const scrolled = ref(false);

        // Tema oscuro/claro
        const isDark = ref(false);

        // Secciones disponibles
        const sections = [
            { id: 'estilos', name: 'Estilos' },
            { id: 'transiciones', name: 'Transiciones' },
            { id: 'gsap', name: 'GSAP' },
            { id: 'axios', name: 'Axios' },
            { id: 'utilidades', name: 'Utilidades' }
        ];

        /* ============================================
           1. MANEJO DE ESTILOS COMO ATRIBUTOS
           v-bind:style - Binding dinámico de estilos inline
           ============================================ */
        const styles = reactive({
            opacity: 1,
            borderRadius: 8,
            backgroundColor: '#3b82f6',
            transform: 'rotate(0deg)'
        });

        const colorIndex = ref(0);
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

        // Computed para estilos dinámicos
        const dynamicStyles = computed(() => ({
            opacity: styles.opacity,
            borderRadius: `${styles.borderRadius}px`,
            backgroundColor: styles.backgroundColor,
            transform: styles.transform,
            transition: 'all 0.5s ease'
        }));

        const cycleColor = () => {
            colorIndex.value = (colorIndex.value + 1) % colors.length;
            styles.backgroundColor = colors[colorIndex.value];
            gsap.to(styles, {
                transform: `rotate(${Math.random() * 360}deg)`,
                duration: 0.5
            });
        };

        /* ============================================
           2. CLASES CSS DINÁMICAS
           v-bind:class - Toggle de clases condicionales
           ============================================ */
        const elementoActivo = ref(false);
        const clasesDinamicas = reactive([
            { nombre: 'Activo', activa: true },
            { nombre: 'Destacado', activa: false },
            { nombre: 'Oculto', activa: false },
            { nombre: 'Animado', activa: true }
        ]);

        /* ============================================
           3. TRANSICIONES Y RENDERIZADO CONDICIONAL
           <Transition>, <TransitionGroup>, v-if, v-show
           ============================================ */
        const showFade = ref(true);
        const showSlide = ref(true);
        const showBounce = ref(true);
        const showModal = ref(false);

        // Lista para TransitionGroup
        const items = ref([
            { id: 1, text: 'Vue.js' },
            { id: 2, text: 'Animaciones' },
            { id: 3, text: 'Transiciones' }
        ]);
        let nextId = 4;

        const addItem = () => {
            items.value.push({ id: nextId++, text: `Item ${nextId}` });
        };

        const removeItem = () => {
            if (items.value.length > 0) {
                items.value.pop();
            }
        };

        const removeSpecificItem = (id) => {
            items.value = items.value.filter(item => item.id !== id);
        };

        const shuffleItems = () => {
            items.value = [...items.value].sort(() => Math.random() - 0.5);
        };

        /* ============================================
           4. GSAP - LIBRERÍA EXTERNA
           Integración de GSAP para animaciones avanzadas
           ============================================ */
        const gsapBox = ref(null);
        const timeline1 = ref(null);
        const timeline2 = ref(null);
        const timeline3 = ref(null);
        const staggerElements = ref([]);

        const setStaggerRef = (el, index) => {
            if (el) staggerElements.value[index - 1] = el;
        };

        const animateGSAP = () => {
            // Animación básica con GSAP
            gsap.to(gsapBox.value, {
                rotation: 360,
                scale: 1.2,
                duration: 0.5,
                ease: "back.out(1.7)",
                yoyo: true,
                repeat: 1
            });
        };

        const playTimeline = () => {
            // Timeline de GSAP para secuencias
            const tl = gsap.timeline();
            tl.to(timeline1.value, { x: 100, duration: 0.3 })
                .to(timeline2.value, { x: 100, duration: 0.3 }, "-=0.1")
                .to(timeline3.value, { x: 100, duration: 0.3 }, "-=0.1")
                .to([timeline1.value, timeline2.value, timeline3.value], { x: 0, duration: 0.3 });
        };

        const staggerAnimation = () => {
            // Efecto stagger con GSAP
            gsap.fromTo(staggerElements.value,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }
            );
        };

        const staggerOut = () => {
            gsap.to(staggerElements.value, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in"
            });
        };

        /* ============================================
           5. AXIOS - ENVÍO Y RECEPCIÓN DE DATOS
           Peticiones HTTP GET y POST
           ============================================ */
        const users = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const form = reactive({
            title: '',
            body: ''
        });
        const submitting = ref(false);
        const responseData = ref(null);

        const fetchUsers = async () => {
            loading.value = true;
            error.value = null;
            try {
                // Simulación de delay para mostrar loading
                await new Promise(r => setTimeout(r, 800));
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                users.value = response.data.slice(0, 6); // Solo 6 usuarios
                if (debugMode.value) console.log('Datos recibidos:', users.value);
            } catch (err) {
                error.value = err.message;
                console.error('Error fetching users:', err);
            } finally {
                loading.value = false;
            }
        };

        const submitForm = async () => {
            submitting.value = true;
            try {
                const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
                    title: form.title,
                    body: form.body,
                    userId: 1
                });
                responseData.value = response.data;
                form.title = '';
                form.body = '';
                if (debugMode.value) console.log('Respuesta POST:', response.data);
            } catch (err) {
                console.error('Error submitting form:', err);
            } finally {
                submitting.value = false;
            }
        };

        /* ============================================
           6. UTILIDADES Y HERRAMIENTAS
           Configuraciones de debug y monitoreo
           ============================================ */
        const debugMode = ref(false);
        const showGrid = ref(false);
        const reducedMotion = ref(false);
        const animationSpeed = ref(1);
        const elapsedTime = ref(0);
        const fps = ref(60);
        const memoryUsage = ref('0 MB');
        const vueVersion = ref(Vue.version);
        const componentCount = ref(1);

        let animationFrame;
        let lastTime = performance.now();
        let frameCount = 0;

        // Control de animaciones
        const pauseAllAnimations = () => {
            gsap.globalTimeline.pause();
        };

        const resumeAllAnimations = () => {
            gsap.globalTimeline.resume();
        };

        const reverseAllAnimations = () => {
            gsap.globalTimeline.reverse();
        };

        /* ============================================
           7. CAMBIO DE TEMA (DARK/LIGHT MODE)
           ============================================ */
        const toggleTheme = () => {
            isDark.value = !isDark.value;
            if (isDark.value) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        };

        /* ============================================
           8. LIFECYCLE HOOKS Y UTILIDADES
           ============================================ */
        onMounted(() => {
            // Restaurar tema
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                isDark.value = true;
                document.documentElement.classList.add('dark');
            }

            // Detectar scroll para navbar
            window.addEventListener('scroll', () => {
                scrolled.value = window.scrollY > 20;
            });

            // Loop de animación para métricas
            const updateMetrics = () => {
                const now = performance.now();
                frameCount++;

                if (now - lastTime >= 1000) {
                    fps.value = frameCount;
                    frameCount = 0;
                    lastTime = now;

                    // Simular uso de memoria
                    if (performance.memory) {
                        memoryUsage.value = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
                    }
                }

                elapsedTime.value = (now / 1000).toFixed(1);
                animationFrame = requestAnimationFrame(updateMetrics);
            };
            animationFrame = requestAnimationFrame(updateMetrics);

            // Cargar datos iniciales
            fetchUsers();

            // Inicializar animaciones GSAP
            nextTick(() => {
                staggerAnimation();
            });
        });

        onUnmounted(() => {
            cancelAnimationFrame(animationFrame);
        });

        // Watch para reduced motion (accesibilidad)
        watch(reducedMotion, (newVal) => {
            if (newVal) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                gsap.globalTimeline.timeScale(0);
            } else {
                document.documentElement.style.removeProperty('--animation-duration');
                gsap.globalTimeline.timeScale(1);
            }
        });

        return {
            // Navegación
            currentSection,
            mobileMenuOpen,
            scrolled,
            sections,
            isDark,

            // Estilos
            styles,
            dynamicStyles,
            cycleColor,

            // Clases
            elementoActivo,
            clasesDinamicas,

            // Transiciones
            showFade,
            showSlide,
            showBounce,
            showModal,
            items,
            addItem,
            removeItem,
            removeSpecificItem,
            shuffleItems,

            // GSAP
            gsapBox,
            timeline1,
            timeline2,
            timeline3,
            setStaggerRef,
            animateGSAP,
            playTimeline,
            staggerAnimation,
            staggerOut,

            // Axios
            users,
            loading,
            error,
            form,
            submitting,
            responseData,
            fetchUsers,
            submitForm,

            // Utilidades
            debugMode,
            showGrid,
            reducedMotion,
            animationSpeed,
            elapsedTime,
            fps,
            memoryUsage,
            vueVersion,
            componentCount,
            pauseAllAnimations,
            resumeAllAnimations,
            reverseAllAnimations,

            // Tema
            toggleTheme
        };
    }
}).mount('#app');