import * as SentryBrowser from '@sentry/browser';
import * as SentryMobile from 'sentry-cordova';
import { isPlatform } from '@ionic/core';

export default isPlatform('cordova') || isPlatform('capacitor') ? SentryMobile : SentryBrowser;
