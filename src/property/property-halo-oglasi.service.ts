import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNaN, isNil, toNumber } from 'lodash';
import { Model } from 'mongoose';
import { Browser, Page } from 'puppeteer';
import { puppeteerRequestMediaAbortHandler } from 'src/utils/puppeteer/puppeteer-request-media-abort-handler';
import { sleep } from 'src/utils/sleep';
import { Property } from './schema/property.schema';
import { PROPERTY_PROVIDERS } from './types/property-providers.enum';

@Injectable()
export class PropertyHaloOglasiService {
  private url: string;

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {
    this.url = 'https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd';
  }

  async getPropertiesFromHaloOglasi({ browser }: { browser: Browser }) {
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', puppeteerRequestMediaAbortHandler);

    try {
      await page.goto(this.url);

      const properties = await this.getHaloOglasiPropertiesFromPage({ page });

      for (const property of properties) {
        await this.propertyModel.updateOne({ url: property.url }, property, {
          upsert: true,
        });
      }

      const totalNumberOfPages = await this.getHaloOglasiNumberOfPages({
        page,
      });

      let pageNumber = 2;

      while (pageNumber < totalNumberOfPages) {
        await sleep(2000);

        await this.goToPage({ page, pageNumber });

        const propertiesOnCurrentPage =
          await this.getHaloOglasiPropertiesFromPage({ page });

        for (const property of propertiesOnCurrentPage) {
          await this.propertyModel.updateOne({ url: property.url }, property, {
            upsert: true,
          });
        }
        properties.concat(propertiesOnCurrentPage);

        pageNumber++;
      }

      return properties;
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    }

    return [];
  }

  private async getHaloOglasiPropertiesFromPage({
    page,
  }: {
    page: Page;
  }): Promise<Property[]> {
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
    ).filter<
      Omit<Property, 'provider'> & { provider: undefined | PROPERTY_PROVIDERS }
    >(
      (
        property,
      ): property is Omit<Property, 'provider'> & {
        provider: undefined | PROPERTY_PROVIDERS;
      } => !isNil(property),
    );

    return foundProperties.map((property) => {
      const url = new URL(property.url);
      const propertyWithNeededData: Property = {
        ...property,
        provider: PROPERTY_PROVIDERS.HALO_OGLASI,
        url: url.origin + url.pathname,
      };

      return propertyWithNeededData;
    });
  }

  private async getHaloOglasiNumberOfPages({ page }: { page: Page }) {
    const paginationLinksText = await this.getHaloOglasiPaginationLinksText({
      page,
    });

    const totalNumberOfPages =
      this.getHaloOglasiTotalNumberOfPagesFromPaginationLinksText({
        paginationLinksText,
      });

    return totalNumberOfPages;
  }

  private async goToPage({
    pageNumber,
    page,
  }: {
    pageNumber: number;
    page: Page;
  }) {
    const pageUrl = new URL(this.url);

    pageUrl.searchParams.set('page', pageNumber.toString());

    await page.goto(pageUrl.toString());
  }

  private async getHaloOglasiPaginationLinksText({ page }: { page: Page }) {
    const foundNextPageLinksText = (
      await page.$$eval('a.page-link', (elements) => {
        return elements.slice(0, 100).map((element) => {
          return element.innerText;
        });
      })
    ).filter<string>((text): text is string => !isNil(text));

    return foundNextPageLinksText;
  }

  private getHaloOglasiTotalNumberOfPagesFromPaginationLinksText({
    paginationLinksText,
  }: {
    paginationLinksText: string[];
  }) {
    const totalNumberOfPagesText =
      paginationLinksText[paginationLinksText.length - 2];

    const totalNumberOfPages = toNumber(totalNumberOfPagesText);

    if (isNaN(totalNumberOfPages)) {
      console.error('totalNumberOfPages is NaN');

      return 1;
    }

    return totalNumberOfPages;
  }
}
