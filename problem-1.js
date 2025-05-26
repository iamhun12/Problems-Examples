function calculateMojosEaten(baseMojos) {
  let extraMojos = 0;

  let mutkis = baseMojos;

  while (mutkis >= 3) {
    let exchanged_mojos = Math.floor(mutkis / 3);
    let remainder = mutkis % 3;

    extraMojos += exchanged_mojos;
    mutkis = exchanged_mojos + remainder;
  }

  return extraMojos + baseMojos;
}

const mojos = 10;
console.log(calculateMojosEaten(mojos));
