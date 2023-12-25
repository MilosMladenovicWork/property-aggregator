import { Injectable } from '@nestjs/common';
import { isNaN, isNil, toNumber } from 'lodash';
import { Browser, Page } from 'puppeteer';
import { sleep } from 'src/utils/sleep';
import { Property } from './schema/property.schema';

@Injectable()
export class PropertyHaloOglasiService {
  private url: string;

  constructor() {
    this.url = 'https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd';
  }

  async getPropertiesFromHaloOglasi({ browser }: { browser: Browser }) {
    const page = await browser.newPage();

    try {
      await page.goto(this.url);

      const properties = await this.getHaloOglasiPropertiesFromPage({ page });

      const totalNumberOfPages = await this.getHaloOglasiNumberOfPages({
        page,
      });

      let currentPage = 2;

      while (currentPage < totalNumberOfPages) {
        await sleep(2000);

        await this.goToCurrentPage({ page, currentPage });

        const propertiesOnCurrentPage =
          await this.getHaloOglasiPropertiesFromPage({ page });

        properties.concat(propertiesOnCurrentPage);

        currentPage++;
      }

      return properties;
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    }

    return [];
  }

  private async getHaloOglasiPropertiesFromPage({ page }: { page: Page }) {
    const foundProperties = (
      await page.$$eval('.product-item:not(.banner-list)', (elements) => {
        return elements.slice(0, 100).map((element) => {
          const title =
            element.querySelector<HTMLElement>('h3.product-title')?.innerText;

          const locationHtmlElements = element.querySelectorAll<HTMLElement>(
            '.subtitle-places li',
          );

          const location = Array.from(locationHtmlElements)
            .map((element) => element?.innerText)
            .filter((text) => text !== '');

          const image = element
            .querySelector<HTMLElement>('.a-images > img')
            ?.getAttribute('src');

          const href = element
            .querySelector<HTMLElement>('.a-images')
            ?.getAttribute('href');

          if (!image || !title || !href) {
            return;
          }

          const property = {
            title,
            location,
            image,
            url: new URL(href, 'https://halooglasi.com').toString(),
          };

          return property;
        });
      })
    ).filter<Property>((property): property is Property => !isNil(property));

    return foundProperties;
  }

  private async getHaloOglasiNumberOfPages({ page }: { page: Page }) {
    const foundNextPageLinksText = (
      await page.$$eval('a.page-link', (elements) => {
        return elements.slice(0, 100).map((element) => {
          return element.innerText;
        });
      })
    ).filter<string>((text): text is string => !isNil(text));

    const totalNumberOfPagesText =
      foundNextPageLinksText[foundNextPageLinksText.length - 2];

    const totalNumberOfPages = toNumber(totalNumberOfPagesText);

    if (isNaN(totalNumberOfPages)) {
      console.error('totalNumberOfPages is NaN');

      return 1;
    }

    return totalNumberOfPages;
  }

  private async goToCurrentPage({
    currentPage,
    page,
  }: {
    currentPage: number;
    page: Page;
  }) {
    const pageUrl = new URL(this.url);

    pageUrl.searchParams.set('page', currentPage.toString());

    await page.goto(pageUrl.toString());
  }
}
