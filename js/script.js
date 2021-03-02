// 변수
let header = document.querySelector('header');
let nav = header.querySelector('nav');

let main = document.querySelector('main');
let slide = main.querySelector('.slide');
let prevBtn = slide.querySelector('.prevBtn');
let nextBtn = slide.querySelector('.nextBtn');
let slideLi = slide.querySelectorAll('li');
let imgWidth = slide.querySelector('img').offsetWidth;

let quiz = document.querySelector('.quiz');
let startArea = quiz.querySelector('.startArea');
let quizStartBtn = quiz.querySelector('.quizStartBtn');
let questionArea = quiz.querySelector('.questionArea');
let questionTitle = quiz.querySelector('.questionTitle');
let questionBtn = quiz.querySelectorAll('.questionBtn');
let index = quiz.querySelector('.index');
let nextQuestionBtn = quiz.querySelector('.nextQuestionBtn');
let warning = quiz.querySelector('.warning');
let resultArea = quiz.querySelector('.resultArea');
let resultPhone = quiz.querySelector('.resultPhone');
let indexCount = 1;
let answer = [];


// header > .gnb(메인메뉴) 마우스 오버 ---> .depth 노출/비노출
nav.addEventListener('mouseover', depthOn);
nav.addEventListener('mouseout', depthOff);

// main > .visual > .slide(슬라이더) 클릭 ---> 이미지 돌아가기
prevBtn.addEventListener('click', prevImgSlide);
nextBtn.addEventListener('click', nextImgSlide);

// main > .quiz > .quizStartBtn(테스트 시작) 클릭 ---> 퀴즈 시작
quizStartBtn.addEventListener('click', quizStart);
// main > .quiz > .questionBtn(선택지) 클릭 ---> 클래스 추가
questionBtn.forEach((item) => item.addEventListener('click', questionBtnSelected));
// main > .quiz > .nextQuestionBtn(다음) 클릭 ---> 다음 퀴즈 노출
nextQuestionBtn.addEventListener('click', nextQuestionClicked);



// 함수
function depthOn() {
    nav.querySelectorAll('.depth').forEach((item) => item.classList.add('on'));
    header.querySelector('section').classList.add('headerSectionOn');
};

function depthOff() {
    nav.querySelectorAll('.depth').forEach((item) => item.classList.remove('on'));
};


function prevImgSlide() {
    if(slideLi.length === 1 || parseFloat(getComputedStyle(slideLi[0]).left) === 0) {
        return; // 슬라이드 개수가 1개거나, left가 0일 때 제외
    } else if(slideLi.length > 1) {
        slideLi.forEach((item) => {
            let leftNum = parseFloat(getComputedStyle(item).left);

            item.style.left = leftNum + imgWidth + 'px';
        });
    };
};

function nextImgSlide() {
    if(slideLi.length === 1) {
        return;
    } else if(slideLi.length > 1) {
        slideLi.forEach((item) => {
            let leftNum = parseFloat(getComputedStyle(item).left);

            if(Math.abs(leftNum) === (slideLi.length - 1) * imgWidth) { // 제일 마지막 슬라이드일 때
                item.style.left = 0; // 처음으로 돌아가기
            } else {
                item.style.left = leftNum - imgWidth + 'px';
            }
        });
    };
};


function quizStart() {
    startArea.classList.add('off');
    quizStartBtn.classList.add('off');
    questionArea.classList.add('on');
    questionShow();
};

function questionShow() {
    index.textContent = `${indexCount}/4`;
    questionTitle.textContent = questions[indexCount - 1].title;

    let keys = [];
    for(let key in questions[0]) {
        keys.push(key); // ["title", "choice1", "choice2"]
    };

    for(let i=1; i<keys.length; i++) {
        questionBtn.forEach((item) => {
            item.textContent = questions[indexCount - 1][keys[i]].text;
            keys.splice(keys[i], 1);
        });
    };
};

function questionBtnSelected(e) {
    let target = e.target;

    questionBtn.forEach((item) => item.classList.remove('selected'));
    target.classList.add('selected');
};

function nextQuestionClicked() {
    let selectedBtnCnt = 0;
    let selectedBtn;

    questionBtn.forEach((item, index) => {
        if(item.classList.contains('selected')) {
            selectedBtnCnt++
            selectedBtn = index;
        }
    });

    if(selectedBtnCnt === 0) { // 선택된 버튼이 하나도 없을 때
        warning.classList.add('on');
    } else if(indexCount === 4) { // 마지막 문제일 때
        answer.push(questions[indexCount - 1]['choice' + (selectedBtn + 1)].score);
        yourPhoneIs();
    } else {
        answer.push(questions[indexCount - 1]['choice' + (selectedBtn + 1)].score);
        questionBtn.forEach((item) => item.classList.remove('selected'));
        warning.classList.remove('on');
        indexCount++;
        questionShow();
    } 
};

function yourPhoneIs() {
    let keys = []; 
    for(let key in answer[0]) {
        keys.push(key); // ["galaxy", "iphone", "other"]
    };

    let totalScore = [];
    keys.forEach((item) => {
        totalScore.push(answer.reduce((prev, curr) => {
            return prev + curr[item]; // [2,4,5]
        }, 0));
    });

    let result = []; //없애도 됨
    let _result = [];
    for(let i=0; i<keys.length; i++) {
        totalScore.map((argT) => {
            result[keys[i]] = argT; // [galaxy: 2, iphone: 4, other: 5]
            _result.push([keys[i], argT]); // [[galaxy, 2], [iphone, 4], [other, 5]]
            keys.splice(keys[i], 1);
        });
    };

    _result = _result.sort((a, b) => b[1] - a[1]); // [[other, 5], [iphone, 4], [galaxy, 2]

    questionArea.classList.add('off');
    resultArea.querySelector('span').classList.add('on');
    resultArea.classList.add('on');
    resultArea.querySelector('img').setAttribute('src', `./img/${_result[0][0]}01.jpg`);
    console.log(_result);
    resultPhone.textContent = _result[0][0]; // other
};



// Obejct
let questions = [
    {
        title: '자고로 스마트폰이란...',
        choice1: {
            text: '편하게 국내 스마트폰이 좋아',
            score: {
                galaxy: 3,
                iphone: 0,
                other: 0
            }
        },
        choice2: {
            text: '유니크하게 해외 스마트폰이 좋아',
            score: {
                galaxy: 0,
                iphone: 2,
                other: 1
            }
        }
    },
    {
        title: '나는 스마트폰을 살때...',
        choice1: {
            text: '무조건 가성비가 최고!',
            score: {
                galaxy: 2,
                iphone: 1,
                other: 3
            }
        },
        choice2: {
            text: '디자인이나 갬성을 느끼는게 최고!',
            score: {
                galaxy: 0,
                iphone: 3,
                other: 1
            }
        }
    },
    {
        title: '스마트폰 보험이 되지 않는다면?',
        choice1: {
            text: '보험/케어는 필수지',
            score: {
                galaxy: 2,
                iphone: 1,
                other: 0
            }
        },
        choice2: {
            text: '난 상관없어! 그럴 일 없거든',
            score: {
                galaxy: 1,
                iphone: 1,
                other: 2
            }
        }
    },
    {
        title: '나는 내가 좋아한다면',
        choice1: {
            text: '불편한 기능이 있어도 그냥 쓸 수 있어!',
            score: {
                galaxy: 0,
                iphone: 3,
                other: 2
            }
        },
        choice2: {
            text: '난 안돼.. 무조건 기능이 다양하고 편해야해!',
            score: {
                galaxy: 3,
                iphone: 1,
                other: 1
            }
        }
    }
];