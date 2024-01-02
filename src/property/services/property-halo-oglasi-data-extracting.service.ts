import { Injectable } from '@nestjs/common';
import { isNaN, isNil, toNumber } from 'lodash';
import { Page } from 'puppeteer';
import { Property } from '../schema/property.schema';
import { PROPERTY_PROVIDERS } from '../types/property-providers.enum';

@Injectable()
export class PropertyHaloOglasiDataExtractingService {
  constructor() {}

  public async getHaloOglasiNumberOfPagesFromPropertyResultsPage({
    page,
  }: {
    page: Page;
  }) {
    const paginationLinksText = await this.getHaloOglasiPaginationLinksText({
      page,
    });

    const totalNumberOfPages =
      this.getHaloOglasiTotalNumberOfPagesFromPaginationLinksText({
        paginationLinksText,
      });

    return totalNumberOfPages;
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

  async getHaloOglasiPropertyDataFromPropertyPage({
    property,
    page,
  }: {
    property: Property;
    page: Page;
  }): Promise<Property> {
    const foundProperty: Partial<Property> = (
      await page.$$eval('.product-page', (elements) => {
        return elements.slice(0, 1).map((element) => {
          const description =
            element.querySelector<HTMLElement>('#plh50')?.innerText;

          const propertyType = element.querySelector<HTMLElement>(
            '.prominent li:nth-of-type(1) span:nth-of-type(2)',
          )?.innerText;

          const squareMeters = element
            .querySelector<HTMLElement>(
              '.prominent li:nth-of-type(2) span:nth-of-type(2)',
            )
            ?.innerText?.split(' ')[0];

          const numberOfRooms = element.querySelector<HTMLElement>(
            '.prominent li:nth-of-type(3) span:nth-of-type(2)',
          )?.innerText;

          const propertyFlags = Array.from(
            element.querySelectorAll<HTMLElement>('.flags-container label'),
          )
            .slice(0, 100)
            .map((propertyFlagElement) => propertyFlagElement.innerText);

          const price =
            element.querySelector<HTMLElement>('.offer-price-value')?.innerText;

          const property = {
            description,
            squareMeters: Number(squareMeters),
            propertyType,
            numberOfRooms,
            propertyFlags,
            price: price ? Number(price.replace(/[^0-9.-]+/g, '')) : null,
          };

          return property;
        });
      })
    )[0];

    console.log('Crawler - Extracting data for property', {
      url: property.url,
    });

    return { ...property, ...foundProperty };
  }

  async getHaloOglasiPropertiesFromPropertyResultsPage({
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

    console.log(
      'Crawler - Extracting data for properties on page: ',
      page.url(),
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
}
