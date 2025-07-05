
document.addEventListener('DOMContentLoaded', () => {
    const languageButtons = document.querySelectorAll('[data-lang-switch]');
    const langElements = document.querySelectorAll('[data-lang]');
    const analyzeBtn = document.getElementById('analyze-btn');
    const readingSection = document.getElementById('reading-section');
    const paymentForm = document.getElementById('payment-form');
    const dominantHandInput = document.getElementById('dominant-hand');
    const otherHandInput = document.getElementById('other-hand');
    const teaserReading = document.getElementById('teaser-reading');

    const translations = {
        en: {
            "Romani Hand-Palm Reading": "Romani Hand-Palm Reading",
            "Unveil Your Destiny": "Unveil Your Destiny",
            "Step into the mystical world of Romani palmistry. Upload images of your hands and let the ancient wisdom reveal the secrets of your past, present, and future.": "Step into the mystical world of Romani palmistry. Upload images of your hands and let the ancient wisdom reveal the secrets of your past, present, and future.",
            "Upload Your Hand Images": "Upload Your Hand Images",
            "Dominant Hand": "Dominant Hand",
            "Other Hand": "Other Hand",
            "Analyze Hands": "Analyze Hands",
            "A Glimpse into Your Future": "A Glimpse into Your Future",
            "The lines on your hand tell a story of a passionate and determined soul. You are destined for greatness, but there are challenges ahead that will test your spirit...": "The lines on your hand tell a story of a passionate and determined soul. You are destined for greatness, but there are challenges ahead that will test your spirit...",
            "Unlock Your Full Reading": "Unlock Your Full Reading",
            "For the complete, detailed analysis of your life's journey, please enter your email and proceed to payment.": "For the complete, detailed analysis of your life's journey, please enter your email and proceed to payment.",
            "Pay Now": "Pay Now",
            "&copy; 2025 Romani Hand-Palm Reading. All rights reserved.": "&copy; 2025 Romani Hand-Palm Reading. All rights reserved.",
            "Analyzing...": "Analyzing..."
        },
        fr: {
            "Romani Hand-Palm Reading": "Lecture de la Main à la Romani",
            "Unveil Your Destiny": "Dévoilez Votre Destin",
            "Step into the mystical world of Romani palmistry. Upload images of your hands and let the ancient wisdom reveal the secrets of your past, present, and future.": "Entrez dans le monde mystique de la chiromancie romani. Téléchargez des images de vos mains et laissez la sagesse ancienne révéler les secrets de votre passé, présent et futur.",
            "Upload Your Hand Images": "Téléchargez les Images de Vos Mains",
            "Dominant Hand": "Main Dominante",
            "Other Hand": "Autre Main",
            "Analyze Hands": "Analyser les Mains",
            "A Glimpse into Your Future": "Un Aperçu de Votre Avenir",
            "The lines on your hand tell a story of a passionate and determined soul. You are destined for greatness, but there are challenges ahead that will test your spirit...": "Les lignes de votre main racontent l'histoire d'une âme passionnée et déterminée. Vous êtes destiné à la grandeur, mais des défis à venir mettront votre esprit à l'épreuve...",
            "Unlock Your Full Reading": "Débloquez Votre Lecture Complète",
            "For the complete, detailed analysis of your life's journey, please enter your email and proceed to payment.": "Pour l'analyse complète et détaillée de votre parcours de vie, veuillez entrer votre email et procéder au paiement.",
            "Pay Now": "Payer Maintenant",
            "&copy; 2025 Romani Hand-Palm Reading. All rights reserved.": "&copy; 2025 Lecture de la Main à la Romani. Tous droits réservés.",
            "Analyzing...": "Analyse en cours..."
        },
        pt: {
            "Romani Hand-Palm Reading": "Leitura de Mão Cigana",
            "Unveil Your Destiny": "Desvende o Seu Destino",
            "Step into the mystical world of Romani palmistry. Upload images of your hands and let the ancient wisdom reveal the secrets of your past, present, and future.": "Entre no mundo místico da quiromancia cigana. Carregue imagens das suas mãos e deixe a sabedoria antiga revelar os segredos do seu passado, presente e futuro.",
            "Upload Your Hand Images": "Carregar Imagens das Suas Mãos",
            "Dominant Hand": "Mão Dominante",
            "Other Hand": "Outra Mão",
            "Analyze Hands": "Analisar Mãos",
            "A Glimpse into Your Future": "Um Vislumbre do Seu Futuro",
            "The lines on your hand tell a story of a passionate and determined soul. You are destined for greatness, but there are challenges ahead that will test your spirit...": "As linhas da sua mão contam a história de uma alma apaixonada e determinada. Você está destinado à grandeza, mas há desafios pela frente que testarão o seu espírito...",
            "Unlock Your Full Reading": "Desbloqueie a Sua Leitura Completa",
            "For the complete, detailed analysis of your life's journey, please enter your email and proceed to payment.": "Para a análise completa e detalhada da sua jornada de vida, por favor, insira o seu email e prossiga para o pagamento.",
            "Pay Now": "Pagar Agora",
            "&copy; 2025 Romani Hand-Palm Reading. All rights reserved.": "&copy; 2025 Leitura de Mão Cigana. Todos os direitos reservados.",
            "Analyzing...": "Analisando..."
        },
        ca: {
            "Romani Hand-Palm Reading": "Lectura de Mà Gitana",
            "Unveil Your Destiny": "Desvetlla el Teu Destí",
            "Step into the mystical world of Romani palmistry. Upload images of your hands and let the ancient wisdom reveal the secrets of your past, present, and future.": "Entra al món místic de la quiromància gitana. Puja imatges de les teves mans i deixa que l'antiga saviesa reveli els secrets del teu passat, present i futur.",
            "Upload Your Hand Images": "Puja les Imatges de les Teves Mans",
            "Dominant Hand": "Mà Dominant",
            "Other Hand": "Altra Mà",
            "Analyze Hands": "Analitzar Mans",
            "A Glimpse into Your Future": "Un Vistazo al Teu Futur",
            "The lines on your hand tell a story of a passionate and determined soul. You are destined for greatness, but there are challenges ahead that will test your spirit...": "Les línies de la teva mà expliquen la història d'una ànima apassionada i determinada. Estàs destinat a la grandesa, però hi ha reptes per endavant que posaran a prova el teu esperit...",
            "Unlock Your Full Reading": "Desbloqueja la Teva Lectura Completa",
            "For the complete, detailed analysis of your life's journey, please enter your email and proceed to payment.": "Per a l'anàlisi completa i detallada del teu viatge de vida, si us plau, introdueix el teu correu electrònic i procedeix al pagament.",
            "Pay Now": "Pagar Ara",
            "&copy; 2025 Romani Hand-Palm Reading. All rights reserved.": "&copy; 2025 Lectura de Mà Gitana. Tots els drets reservats.",
            "Analyzing...": "Analitzant..."
        }
    };

    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        langElements.forEach(el => {
            const key = el.dataset.langKey || el.innerText;
            if (!el.dataset.langKey) {
                el.dataset.langKey = key;
            }
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
        languageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.langSwitch === lang);
        });
    }

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            setLanguage(button.dataset.langSwitch);
        });
    });

    analyzeBtn.addEventListener('click', async () => {
        if (dominantHandInput.files.length === 0) {
            alert('Please upload an image for your dominant hand.');
            return;
        }

        const formData = new FormData();
        formData.append('dominantHand', dominantHandInput.files[0]);
        if (otherHandInput.files.length > 0) {
            formData.append('otherHand', otherHandInput.files[0]);
        }

        // Show loading state
        readingSection.classList.remove('hidden');
        teaserReading.innerText = translations[currentLang]["Analyzing..."];

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed. Please try again.');
            }

            const result = await response.json();
            teaserReading.innerText = result.reading;

        } catch (error) {
            console.error('Error:', error);
            teaserReading.innerText = 'An error occurred during analysis. Please check the console and try again.';
        }
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! In a real application, the full reading would be sent to your email.');
    });

    // Set initial language
    setLanguage('en');
});
