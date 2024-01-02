import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { Page } from 'puppeteer';
import { Property } from '../schema/property.schema';
import { PROPERTY_PROVIDERS } from '../types/property-providers.enum';

@Injectable()
export class Property4ZidaDataExtractingService {
  constructor() {}

  public async getHaloOglasiNumberOfPagesFromPropertyResultsPage() {
    // restriction imposed by 4 zida
    return 100;
  }

  async get4ZidaPropertyDataFromPropertyPage({
    property,
    page,
  }: {
    property: Property;
    page: Page;
  }): Promise<Property> {
    const foundProperty: Partial<Property> = (
      await page.$$eval('.main-container', (elements) => {
        return elements.slice(0, 1).map((element) => {
          const title = element.querySelector<HTMLElement>('h1')?.innerText;

          const description =
            element.querySelector<HTMLElement>('p')?.innerText;

          const squareMeters = element
            .querySelector<HTMLElement>('.basic-info span:nth-of-type(1)')
            ?.innerText?.split(' ')[0];

          const numberOfRooms = element
            .querySelector<HTMLElement>('.basic-info span:nth-of-type(2)')
            ?.innerText?.split(' ')[0];

          const propertyFlags = Array.from(
            element.querySelectorAll<HTMLElement>('app-info-item strong'),
          )
            .slice(0, 100)
            .map((propertyFlagElement) => propertyFlagElement.innerText);

          const price = element
            .querySelector<HTMLElement>('.prices strong')
            ?.innerText?.split(/&nbsp;/g)[0];

          const locationPrimaryHTMLElement = element.querySelector<HTMLElement>(
            'app-place-info strong',
          );

          const locationSecondaryHTMLElement =
            element.querySelector<HTMLElement>('app-place-info span');

          const locationSecondaryInnerTextList =
            locationSecondaryHTMLElement?.innerText?.split(',') || [];

          const location = [locationPrimaryHTMLElement?.innerText]
            .concat(locationSecondaryInnerTextList)
            .filter(
              (locationText): locationText is string =>
                typeof locationText !== 'undefined' && locationText !== '',
            );

          const property = {
            title,
            description,
            squareMeters: Number(squareMeters),
            propertyType: 'stan',
            numberOfRooms,
            propertyFlags,
            price: price ? Number(price.replace(/[^0-9.-]+/g, '')) : null,
            location,
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

  async get4ZidaPropertiesFromPropertyResultsPage({
    page,
  }: {
    page: Page;
  }): Promise<Property[]> {
    const foundProperties = (
      await page.$$eval('app-ad-search-preview-compact', (elements) => {
        return elements.slice(0, 100).map((element) => {
          const title = element.querySelector<HTMLElement>(
            'div > p:nth-of-type(1)',
          )?.innerText;

          const locationHtmlElements = element.querySelectorAll<HTMLElement>(
            'div > p:nth-of-type(1)',
          );

          const location = Array.from(locationHtmlElements)
            .map((element) => element?.innerText)
            .filter((text) => text !== '');

          const image = element
            .querySelector<HTMLElement>('img')
            ?.getAttribute('src');

          const href = element
            .querySelector<HTMLElement>('a')
            ?.getAttribute('href');

          if (!image || !title || !href) {
            return;
          }

          const property = {
            title,
            location,
            image,
            url: new URL(href, 'https://www.4zida.rs').toString(),
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
        provider: PROPERTY_PROVIDERS.CETIRI_ZIDA,
        url: url.origin + url.pathname,
      };

      return propertyWithNeededData;
    });
  }
}
