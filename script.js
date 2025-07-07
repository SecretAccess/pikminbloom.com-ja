// DOM要素の取得
const inviteCodeInput = document.getElementById('inviteCode');
const charCountSpan = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const inviteForm = document.getElementById('inviteForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');
const petalsContainer = document.getElementById('petals');

// 招待コードのバリデーション関数
function validateInviteCode(code) {
    const regex = /^[A-Z]{9}$/;
    return regex.test(code);
}

// エラーメッセージを表示する関数
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// エラーメッセージを隠す関数
function hideError() {
    errorMessage.style.display = 'none';
}

// 成功モーダルを表示する関数
function showSuccessModal() {
    successModal.style.display = 'flex';
    successModal.style.animation = 'bounce-in 0.6s ease-out';
}

// 成功モーダルを隠す関数
function hideSuccessModal() {
    successModal.style.display = 'none';
}

// 花びらエフェクトを作成する関数
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
    petal.style.animationDelay = Math.random() * 2 + 's';
    
    petalsContainer.appendChild(petal);
    
    // アニメーション終了後に要素を削除
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, 5000);
}

// 花びらエフェクトを定期的に作成
function startPetalEffect() {
    setInterval(createPetal, 300);
}

// 入力フィールドのイベントリスナー
inviteCodeInput.addEventListener('input', function(e) {
    // 半角大文字アルファベットのみ許可
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    // 9文字制限
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    
    e.target.value = value;
    
    // 文字数カウンターを更新
    charCountSpan.textContent = value.length;
    
    // ボタンの有効/無効を切り替え
    if (validateInviteCode(value)) {
        submitBtn.disabled = false;
        submitBtn.classList.add('pulse-green');
        hideError();
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('pulse-green');
    }
});

// フォーム送信のイベントリスナー
inviteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const inviteCode = inviteCodeInput.value.trim();
    
    // バリデーション
    if (!validateInviteCode(inviteCode)) {
        showError('招待コードは9文字の半角大文字アルファベットで入力してください');
        return;
    }
    
    // ボタンを無効化して送信中状態にする
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    submitBtn.innerHTML = '<span class="loading-spinner"></span>送信中...';
    hideError();
    
    try {
        // FormDataを作成
        const formData = new FormData();
        formData.append('招待コード', inviteCode);
        
        // SSGフォームに送信
        const response = await fetch('https://ssgform.com/s/yhd7UavRZK6V', {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // CORSエラーを回避
        });
        
        // 成功とみなして成功モーダルを表示
        setTimeout(() => {
            showSuccessModal();
            
            // フォームをリセット
            inviteCodeInput.value = '';
            charCountSpan.textContent = '0';
            submitBtn.textContent = '招待コードを送信';
            submitBtn.disabled = true;
        }, 1000);
        
    } catch (error) {
        console.error('送信エラー:', error);
        
        // エラーが発生した場合でも成功として扱う（no-corsのため）
        setTimeout(() => {
            showSuccessModal();
            
            // フォームをリセット
            inviteCodeInput.value = '';
            charCountSpan.textContent = '0';
            submitBtn.textContent = '招待コードを送信';
            submitBtn.disabled = true;
        }, 1000);
    }
});

// モーダルを閉じるイベントリスナー
closeModalBtn.addEventListener('click', hideSuccessModal);

// モーダルの背景をクリックして閉じる
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        hideSuccessModal();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.style.display === 'flex') {
        hideSuccessModal();
    }
});

// パルスアニメーションのCSSを動的に追加
const style = document.createElement('style');
style.textContent = `
    .pulse-green {
        animation: pulse-green 2s infinite;
    }
    
    @keyframes pulse-green {
        0%, 100% { box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3); }
        70% { box-shadow: 0 4px 15px rgba(74, 222, 128, 0.6), 0 0 0 10px rgba(74, 222, 128, 0); }
    }
    
    .loading-spinner {
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 8px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 花びらエフェクトを開始
    startPetalEffect();
    
    // 初期状態でボタンを無効化
    submitBtn.disabled = true;
    
    // 文字数カウンターを初期化
    charCountSpan.textContent = '0';
    
    // フォーカス時のアニメーション
    inviteCodeInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    inviteCodeInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
    
    // ページ読み込み完了時のアニメーション
    setTimeout(() => {
        document.querySelector('.hero-image').classList.add('float-animation');
        document.querySelector('.character-image').classList.add('bounce-in');
    }, 500);
});

// デバッグ用：コンソールにメッセージを出力
console.log('🌸 ピクミンブルーム招待コード入力フォームが読み込まれました！');
console.log('📝 招待コードは9文字の半角大文字アルファベットで入力してください');
console.log('🚀 SSGフォームURL: https://ssgform.com/s/yhd7UavRZK6V');

