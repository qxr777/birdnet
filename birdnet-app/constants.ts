
import { BirdMatch, RecognitionResult } from './types';

export const ASSETS = {
  FOREST_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCppsDwBmcIbR7wv-fdz7Qy0HuuKe0ua0NgdE_kVRs9pRh5n_pko6g1E2ie8Xh1bU7SlcmtEbNHc6sBEjm9r7qM22BE0TUirBPffAx80pUTRaX7hRH52hWRmTfatgFEKDTK5TlK0V2NhM_FrGNS-q53OA2y5zVRmjxSOrowapMhcuQmX5MBqCNmRx69K-1TIVn8xdd6Cy_Mrb0HYGXUK4QzWcEi9Lv4l4mYlnersH-z6I2dBci3lgd6j91g90V-vdGKjb8ctlqqckpo',
  SPECTROGRAM: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeB9osKfIpolswOl2IC_rdG_xjhoM82Solz01FZ7X97cWJs9UXDBflai1FbEdRwQt-3Q3ZXorpkqb6hQ8qVx-ndBULPbAcxHZe-FAONPLV5kBk9wUK7n6gJEzUEMYgqVIzEwkGuJwbwe-imputcGJjGXEQhBNRcQLj1hsamTkQH6RAbEJvElSYDCSyOokPGJZsdTQFY0ZX-BgcMrZOfbRyc0WMOGfO8YCt9fovPvDBOqyEKrUXQkXrNvg3PFssC3OCg7kyhYuLUV-_',
  WAVEFORM_THUMB: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0OuL1fE8yZmtGNjBx13-e1zj0RoitL1FqQGVvBpWw9irNDM0sVJavbdqPRI1Rq8XKfP2-5P5KyTBhk4qIje_gUPJPs7LmuQNA31Q1l0FQ8PHrpq7Wv9vdubh4lFr4Ro6o_a_k1H46yENpCImQFLCT5kLrrFXylXdhajT8UfpFCI3WMZSjE60EpQNDQBNJ74NHH1oB9PJuWtMXhxR905Xur_NmEfyPz1Hzv_ncI740ZIMCIgI_F5CJ0eAsg5sAjuiWXWlz2MrI-2OJ',
};

export const MOCK_BIRDS: BirdMatch[] = [
  {
    name: '东方鹊鸲',
    scientificName: 'Oriental Magpie-Robin',
    confidence: 98,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQTVWxHZAozoKMOBlUGxNcf_j1ZM1VoO090GKf5H66XKnWdAGnx4TCky-y2_xi1bpRA8_C2X2FympH07h2Gnu8_jfkEHMGQ7mSMrFHF_kOjGk_ndp4TkkwfTFMd7zF4rVB5xIKfH67NZVtQn90vkov854QFs5Eeja2cndt8JvYleda1ApUWsOb9HH0G9LT2KZvQKZj1RkLCQ_qvCMUef8iGfPlsXbL_T2Eu_PuM7IPJDSBtukUoM1rPGjmDJ4Q6fe_TLMjQhx1LeJ',
  },
  {
    name: '麻雀',
    scientificName: 'Eurasian Tree Sparrow',
    confidence: 15,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbWspjOgdMiqGuuc9t8zusiuNoIe3yeoOAyArbwgytdSidHmAqkjSUayIvBoaafq9yM9PtxWVIAxwdZZ4OtDhVTwfFbLkdw4RUczyHPmEO7tRPnlysjfMOGs0SOC9UI94h9suqRN7bMpK_VFGfGfm3KRbX0N5YpGR2KvAPfhJWWvZUz_4xrzmvHiJWBp20rcYZHCkaJw-nTwQWz9oeQAJWmBndcSwzOBWnnQVbnEEHoHgPjl5zQtSFTMxKJ3ie00e5UzvldpnepZtI',
  },
  {
    name: '白鹡鸰',
    scientificName: 'White Wagtail',
    confidence: 5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpCwRxd6QpTTI8RjWVwUMnUlTeB7Kg8wSMrNQuUxVjm7rpi5rJ4VqXo-UDJwcayjtZMxkHqrn6rSyBg2jM4__Cl6zE6IHu0a0bDPIH5b6ptndF_uHmHzq-jluZ-aq89hdf5Xs8S2ybSIEaz4UTZ094-GRJmvnpQvLuKQslwb8Q5BsdEPTPv1JAKNXk84papgx1HNh_9hxt6rHQpE6xmhs-cYMwJIk7TM-1CKE988a-Sh-DfZXG-khE6q5vylAAoOZ1rVi-XifH8qk3',
  }
];

export const MOCK_RESULT: RecognitionResult = {
  id: '#042',
  timestamp: '今天 14:30',
  location: '郊野公园',
  duration: '0:12',
  primaryMatch: MOCK_BIRDS[0],
  alternatives: [MOCK_BIRDS[1], MOCK_BIRDS[2]],
};
