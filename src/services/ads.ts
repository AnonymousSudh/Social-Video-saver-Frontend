// src/services/ads.ts
import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Ad Unit IDs (Fallback to AdMob Test IDs)
const INTERSTITIAL_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3940256099942544/1033173712';
const REWARDED_UNIT_ID = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3940256099942544/5224354917';

let interstitial: InterstitialAd | null = null;
let rewarded: RewardedAd | null = null;
let isAdmobInitialized = false;

// Statistics trackers for ad frequency
let downloadCounter = 0;

export const initAds = async () => {
  try {
    if (isAdmobInitialized) return;
    
    // Lazy-load to avoid issues on unsupported devices
    const mobileAds = require('react-native-google-mobile-ads').default;
    await mobileAds().initialize();
    isAdmobInitialized = true;
    console.log('AdMob successfully initialized');

    // Preload ads
    loadInterstitial();
    loadRewarded();
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
  }
};

export const loadInterstitial = () => {
  try {
    interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial Ad Loaded');
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial Ad Closed');
      loadInterstitial(); // Preload next
    });

    interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial Ad Error:', error);
    });

    interstitial.load();
  } catch (error) {
    console.error('Failed to create or load Interstitial Ad:', error);
  }
};

export const showInterstitialAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (interstitial && interstitial.loaded) {
        const subscription = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          subscription.remove();
          resolve(true);
        });
        interstitial.show();
      } else {
        console.log('Interstitial Ad not loaded, reloading...');
        loadInterstitial();
        resolve(false);
      }
    } catch (e) {
      console.error('Error showing Interstitial:', e);
      resolve(false);
    }
  });
};

export const loadRewarded = () => {
  try {
    rewarded = RewardedAd.createForAdRequest(REWARDED_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Rewarded Ad Loaded');
    });

    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Rewarded Ad Closed');
      loadRewarded(); // Preload next
    });

    rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Rewarded Ad Error:', error);
    });

    rewarded.load();
  } catch (error) {
    console.error('Failed to create or load Rewarded Ad:', error);
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (rewarded && rewarded.loaded) {
        let earnedReward = false;
        
        const rewardSubscription = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            console.log('User earned reward:', reward);
            earnedReward = true;
          }
        );

        const closeSubscription = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
          rewardSubscription.remove();
          closeSubscription.remove();
          resolve(earnedReward);
        });

        rewarded.show();
      } else {
        console.log('Rewarded Ad not loaded, reloading...');
        loadRewarded();
        resolve(false);
      }
    } catch (e) {
      console.error('Error showing Rewarded:', e);
      resolve(false);
    }
  });
};

export const trackDownloadForAd = async (beforeDownload: boolean): Promise<boolean> => {
  if (beforeDownload) {
    console.log('AdMob: Showing interstitial before download starts');
    return await showInterstitialAd();
  } else {
    downloadCounter++;
    console.log(`AdMob: Download counter at ${downloadCounter}`);
    if (downloadCounter % 3 === 0) {
      console.log('AdMob: 3 downloads reached, showing interstitial ad');
      return await showInterstitialAd();
    }
  }
  return false;
};
