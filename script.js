import cdf from 'https://cdn.jsdelivr.net/gh/stdlib-js/stats-base-dists-normal-cdf@esm/index.mjs';

let inputsList = new Array(6);
let option;

const para = document.querySelector('.final');
const container = document.querySelector('.container');
const results = document.querySelector('.results');

const inputs = document.querySelectorAll('input[type=number]');
const enterButton = document.querySelector('.enter');
const resetButton = document.querySelector('.reset');

const animatedLoading = document.querySelectorAll('.animated-loading');

const optionSelector = document.getElementById('optionSelector');

const deltaPara = document.querySelector('.delta');
const gammaPara = document.querySelector('.gamma');
const thetaPara = document.querySelector('.theta');
const vegaPara = document.querySelector('.vega');
const rhoPara = document.querySelector('.rho');


optionSelector.addEventListener('change', (e) => {
  option = e.target.value;
});

const to2DP = num => num.toFixed(2);
const to2SF = num => num.toPrecision(2);

// Computations

const d1 = (S, K, v, r, q, t) => {
  return (Math.log(S/K) + t*(r - q + (Math.pow(v, 2) / 2))) / (v*Math.sqrt(t));
}
const d2 = (d1, v, t) => {
  return d1 - (v*Math.sqrt(t));
}

const nDash = d => {
  return Math.exp(-1*Math.pow(d, 2)/2)/Math.sqrt(2*Math.PI);
};

const callOptionPremium = (S, q, t, nD1, nD2, K, r) => {
  return to2DP(S*Math.exp(-q*t)*nD1 - K*Math.exp(-r*t)*nD2);
};

const putOptionPremium = (S, q, t, nD1, nD2, K, r) => {
  return to2DP(K*Math.exp(-r*t)*nD2 - S*Math.exp(-q*t)*nD1);
};

const deltaCall = (q, t, nD1) => {
  return to2SF(Math.exp(-q*t)*nD1);
};

const deltaPut = (q, t, nD1) => {
  return to2SF(Math.exp(-q*t)*(nD1 - 1));
};

const gamma = (q, t, S, v, nD1) => {
  return to2SF((Math.exp(-q*t)*nD1)/ (S*v*Math.sqrt(t)));
}

const thetaCall = (T, S, v, q, t, nDashD1, r, K, nD1, nD2) => {
  return to2SF((1/T)*(-(S*v*Math.exp(-q*t)*nDashD1)/2*Math.sqrt(t) - r*K*Math.exp(-r*t)*nD2 + q*S*Math.exp(-q*t)*nD1));
};

const thetaPut = (T, S, v, q, t, nDashD1, r, K, nMinusD1, nMinusD2) => {
  return to2SF((1/T)*(-(S*v*Math.exp(-q*t)*nDashD1)/2*Math.sqrt(t) + r*K*Math.exp(-r*t)*nMinusD2 - q*S*Math.exp(-q*t)*nMinusD1));
};

const vega = (S, q, t, nDashD1) => {
  return to2SF((S*Math.exp(-q*t)*Math.sqrt(t)*nDashD1) / 100);
};

const rhoCall = (K, t, r, nD2) => {
  return to2SF((K*t*Math.exp(-r*t)*nD2) / 100);
};
const rhoPut = (K, t, r, nMinusD2) => {
  return to2SF((-K*t*Math.exp(-r*t)*nMinusD2) / 100);
};

const makeValueBold = (val) => {
  const strong = document.createElement('strong');
  strong.innerText = val;
  return strong;
};

// enter button

enterButton.addEventListener('click', () => {
  para.textContent = '';
  deltaPara.textContent = '';
  gammaPara.textContent = '';
  thetaPara.textContent = '';
  vegaPara.textContent = '';
  rhoPara.textContent = '';
  container.classList.add('hidden');
  results.classList.remove('hidden');
  
  setTimeout(() => {
    animatedLoading.forEach(loadingPanel => loadingPanel.classList.remove('animated-loading'));
    
    inputs.forEach((input, index) => {
      inputsList[index] = input.value;
    });

  inputsList.forEach(input => {
    if(input.length === 0) {
      para.textContent = 'Make sure to fill out every value. Reset and try again.';
      throw new Error('Fill out every value.');
    }
  });
  
  const [S, K, v, r, q, t] = inputsList;

  
  const d1Val = d1(S, K, v, r, q, t);
  const d2Val = d2(d1Val, v, t);
  const nD1 = cdf(d1Val, 0, 1);
  const nD2 = cdf(d2Val, 0, 1);
  const nD1Minus = cdf(-d1Val, 0, 1);
  const nD2Minus = cdf(-d2Val, 0, 1);
  const nD1Dash = nDash(d1Val);

  const call = callOptionPremium(S, q, t, nD1, nD2, K, r);

  const put = putOptionPremium(S, q, t, nD1Minus, nD2Minus, K, r);

  const deltaCallValue = deltaCall(q, t, nD1);
  const deltaPutValue = deltaPut(q, t, nD1);
  const gammaValue = gamma(q, t, S, v, nD1Dash);
  const thetaCallValue = thetaCall(365, S, v, q, t, nD1Dash, r, K, nD1, nD2);
  const thetaPutValue = thetaPut(365, S, v, q, t, nD1Dash, r, K, nD1Minus, nD2Minus);
  const vegaValue = vega(S, q, t, nD1Dash);
  const rhoCallValue = rhoCall(K, t, r, nD2);
  const rhoPutValue = rhoPut(K, t, r, nD2Minus);

  if(option === 'callOption') {
    para.textContent = `The Call Option Premium is ${call}`;
    deltaPara.textContent = `The delta (\u0394) call value is ${deltaCallValue}`;
    gammaPara.textContent = `The gamma (\u0393) value is ${gammaValue}`;
    thetaPara.textContent = `The theta (\u0398) call value is ${thetaCallValue}`;
    vegaPara.textContent = `The vega (V) value is ${vegaValue}`;
    rhoPara.textContent = `The rho (\u03A1) call value is ${rhoCallValue}`;

  } else if (option === 'putOption') {
    para.textContent = `The Put Option Premium is ${put}`;
    deltaPara.textContent = `The delta (\u0394) put value is ${deltaPutValue}`;
    gammaPara.textContent = `The gamma (\u0393) value is ${gammaValue}`;
    thetaPara.textContent = `The theta (\u0398) put value is ${thetaPutValue}`;
    vegaPara.textContent = `The vega (V) value is ${vegaValue}`;
    rhoPara.textContent = `The rho (\u03A1) put value is ${rhoPutValue}`;
  } else {
    para.textContent = 'Invalid input. Try again.'
  }
}, 2500);
  
});

resetButton.addEventListener('click', () => {
  results.classList.add('hidden');
  container.classList.remove('hidden');

  inputs.forEach(input => input.value = '');
  animatedLoading.forEach(loadingPanel => loadingPanel.classList.add('animated-loading'));
});