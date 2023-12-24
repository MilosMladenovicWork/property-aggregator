import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isNil } from 'lodash';
import { Browser, launch } from 'puppeteer';

@Injectable()
export class PropertyService {
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncPropertiesFromExternalProviders() {
    const browser = await launch();

    const haloOglasiProperties = await this.getPropertiesFromHaloOglasi({
      browser,
    });

    console.log(haloOglasiProperties);
  }

  async getPropertiesFromHaloOglasi({ browser }: { browser: Browser }) {
    const page = await browser.newPage();

    try {
      await page.goto(
        'https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd',
      );
      const properties = await page.$$eval(
        '.product-item:not(.banner-list)',
        (elements) => {
          return elements.slice(0, 100).map((element) => {
            if (isNil(element)) {
              return;
            }

            const title =
              element.querySelector<HTMLElement>('h3.product-title')?.innerText;

            const locationHtmlElements = element.querySelectorAll<HTMLElement>(
              '.subtitle-places li',
            );

            const location = !isNil(locationHtmlElements)
              ? Array.from(locationHtmlElements)
              : [];

            const image =
              element.querySelector<HTMLElement>('img.resized-image');

            return {
              title,
              location,
              image,
            };
          });
        },
      );
      console.log('Properties', properties);
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    } finally {
      await browser.close();
    }
  }
}
