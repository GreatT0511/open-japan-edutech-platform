/**
 * Placeholder e-Stat API client for future use.
 *
 * e-Stat (https://www.e-stat.go.jp/) is Japan's portal site for
 * official government statistics. This client will be used to fetch
 * education-related datasets programmatically.
 */
export class EStatClient {
  readonly appId: string;
  readonly baseUrl = "https://api.e-stat.go.jp/rest/3.0/app";

  constructor(appId?: string) {
    this.appId = appId ?? process.env.ESTAT_APP_ID ?? "";
  }

  /**
   * Placeholder method for fetching data from the e-Stat API.
   *
   * @param statsDataId - The statistics table ID to fetch
   * @param params - Additional query parameters
   * @returns The fetched data (not yet implemented)
   */
  async fetchData(statsDataId: string, params?: Record<string, string>): Promise<unknown> {
    console.log(
      `[EStatClient] fetchData called with statsDataId=${statsDataId}, params=${JSON.stringify(params)}`,
    );
    console.log(`[EStatClient] baseUrl=${this.baseUrl}`);

    throw new Error(
      "EStatClient.fetchData is not yet implemented. " +
        "Set ESTAT_APP_ID environment variable and implement the API call.",
    );
  }
}
