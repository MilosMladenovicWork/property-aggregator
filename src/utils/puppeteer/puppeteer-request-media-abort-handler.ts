import { HTTPRequest, Handler } from 'puppeteer';

export const puppeteerRequestMediaAbortHandler: Handler<HTTPRequest> = (
  req,
) => {
  if (['stylesheet', 'font', 'image'].includes(req.resourceType())) {
    req.abort();
  } else {
    req.continue();
  }
};
