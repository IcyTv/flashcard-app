/// <reference types="react-scripts" />
/* eslint-disable @typescript-eslint/no-explicit-any */
interface GoogleAuth {
	accessToken: string;
	tokenId: string;
}

interface ReduxState {
	firebase?: any;
	firestore?: any;
	download?: {
		[id: string]: {
			done: number[];
			data: string[][];
			name: string;
		};
	};
	savedSheets?: {
		names: string[];
		sheets: {
			[id: string]: {
				name: string;
				cols: [number, number];
				includeFirstRow: boolean;
				amount: number;
			}[];
		};
	};
	google?: {
		accessToken: string;
		tokenId: string;
		expiresIn: number;
	};
	history?: any;
	debug?: {
		networkDev: boolean;
		firstTime: boolean;
	};
	settings?: {
		advanced: boolean;
		theme: 'dark' | 'light' | 'auto';
	};
}

declare namespace JSX {
	interface IntrinsicElements {
		'amp-ad': any;
		'amp-auto-ads': any;
	}
}

declare global {
	interface Window {
		picker?: any;
		webkit?: {
			messageHandlers: {
				cordova_iab: {
					postMessage(message: string): void;
				};
			};
		};
	}
}

// declare module 'react-ads' {
// 	interface Provider {
// 		bidProviders?: string[]; //		Array of bidder implementations of the Bidder class that makes the request to handle the bids
// 		bidders?: string[]; //[]	Set the prebid bidders that you want to use. The bidders will be lazyloaded via script tags. This allows us to only import bidders that we want to use.
// 		adIframeTitle?: string; //		Sets that title for all ad container iframes created by pubads service, from this point onwards.
// 		chunkSize?: number; //		This will fetch ads in chunks of the specified number.
// 		networkId?: number; //		DFP network id.
// 		bidHandler({ id, sizes }): any; //	Function		Function used to handle the prebid bids. The function must return a prebid formatted object.
// 		adUnitPath?: string; //		This will set The network Id for all of the ads. The,can overwrite this.
// 		refreshDelay?: number; //		Time to wait before refreshing ads. This allows ads to be added to a queue beforebeing defined and refreshed. This multiple ads to be refreshed at the same time.
// 		setCentering?: boolean; //		Enables/disables centering of ads. This mode must be set before the service is enabled. Centering is disabled by default. In legacy gpt_mobile.js, centering is enabled by default.
// 		targeting?: any; //	Object		Sets page level targeting for all slots. This targeting will apply to all slots.
// 		bidTimeout?: number; //	Max amount of time a bid request can take before requesting ads.
// 		enableVideoAds?: boolean; //		Signals to GPT that video ads will be present on the page. This enables competitive exclusion constraints on display and video ads. If the video content is known, call setVideoContent in order to be able to use content exclusion for display ads.
// 		collapseEmptyDivs?: boolean; //		If you're using the asynchronous mode of Google Publisher Tags (GPT) and know that one or more ad slots on your page don't always get filled, you can instruct the browser to collapse empty divs by adding the collapseEmptyDivs(),method to your tags. This method may trigger a reflow of the content of your,page, so how you use it depends on how often you expect an ad slot to be,filled.
// 		divider?: string; //Divider used when generating the ad id. This is used only if no id is set on the ad.
// 		enableAds?: boolean; //Disables or enables all ads.
// 		lazyOffset?: string; //Amount of pixels an ad has to be relative to the window before lazy loading them.
// 		initTimeout?: number;
// 	} //Amount the bidder initiation script can take. This is used for scripts appended to the page. If no scripts are appendedi n the page then this timeout will end automatically.
// 	interface Ad {
// 		id?: string; //	Id that DFP will use to identify this ad. When not set it will create a default id.
// 		size?: any; //		Defines the size of the GPT slot. This value will be passed to the googletag.defineSlot() fn.
// 		lazy?: boolean;
// 		style?: CSSStyleDeclaration;
// 		lazyOffset?: number; //		Use a value > 0 to lazy load ads x pixels before they show in the window.
// 		networkId?: number; //		Sets the networkId, If the parent has a network id defined it will be overwritten
// 		className?: string; //
// 		priority?: number;
// 		targeting?: any; //		Sets a custom targeting parameter for this slot.
// 		adUnitPath?: string; //	Provider's unitPathId	This will set The network Id for this . This overwrites the value from the .
// 		bidHandler(props, code): any; //Function		Function that generates the bidder code for this ad unit. If the Provider has a bidHandler defined then this ad will receive the generated bids.
// 		sizeMap?: [number, number]; //		Define the the viewport size and the slots allowed to be rendered in the viewportSize.This value is an array so you can define multiple ads per viewport size.
// 		onSlotOnLoad?: any; //	Function		This event is fired when the creative's iframe fires its load event. When rendering rich media ads in sync rendering mode, no iframe is used so no SlotOnloadEvent will be fired.ex.
// 		outOfPageSlot?: boolean; //When set to true it sets the ad as an out of page slot.
// 		setCollapseEmpty?: boolean; //		Sets whether the slot div should be hidden when there is no ad in the slot. This overrides the global,settings.
// 		onSlotRenderEnded?: any; //	Function		This event is fired when the creative code is injected into a slot. This event will occur before the creative's resources are fetched, so the creative may not be visible yet. The event is fired by the service that rendered the slot. Example: To listen to companion ads, add a listener to the companion ads service, not the pubads service. Note: If you need to know when the creative hasfired its load event, consider the SlotOnloadEvent.
// 		onImpressionViewable?: any; //	Function		This event is fired when an impression becomes viewable, according to the ActiveView criteria.
// 		onSlotVisibilityChanged?: any; //	Function		This event is fired whenever the on-screen percentage of an ad slot's area changes. The event is throttled and will not fire more often than once every 200ms.
// 	}
// }

declare module 'google-spreadsheet' {
	// #region API definitions
	interface Border {
		style: Style;
		width: number;
		color: Color;
		colorStyle: ColorStyle;
	}

	interface Borders extends Record<direction, Border> {}

	interface CellFormat {
		NumberFormat: NumberFormat;
		backgroundColor: Color;
		backgroundColorStyle: ColorStyle;
		borders: Borders;
		padding: Padding;
		horizontalAlignment: HorizontalAlign;
		verticalAlignment: VerticalAlign;
		wrapStrategy: WrapStrategy;
		textDirection: TextDirection;
		textFormat: TextFormat;
		hyperlinkDisplayType: HyperlinkDisplayType;
		textRotation: TextRotation;
	}

	interface Color extends Record<'red' | 'green' | 'blue' | 'alpha', number> {}

	interface ColorStyle {
		rgbColor: Color;
		themeColor: ThemeColorType;
	}

	interface DeveloperMetadata {
		metadataId: number;
		metadataKey: string;
		metadataValue: string;
		location: DeveloperMetadataLocation;
		visibility: DeveloperMetadataVisibility;
	}

	interface DeveloperMetadataLocation {
		locationType: DeveloperMetadataLocationType;
		spreadsheet: boolean;
		sheetId: number;
		dimensionRange: DimensionRange;
	}

	enum DeveloperMetadataLocationType {
		DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED,
		ROW,
		COLUMN,
		SHEET,
		SPREADSHEET,
	}

	enum DeveloperMetadataVisibility {
		DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED,
		DOCUMENT,
		PROJECT,
	}

	enum Dimension {
		DIMENSION_UNSPECIFIED,
		ROWS,
		COLUMNS,
	}

	interface DimensionProperties {
		hiddenByFilter: boolean;
		hiddenByUser: boolean;
		pixelSize: number;
		developerMetadata: DeveloperMetadata[];
	}

	interface DimensionRange {
		sheetId: number;
		dimension: Dimension;
		startIndex: number;
		endIndex: number;
	}

	type direction = 'top' | 'bottom' | 'left' | 'right';

	interface GridProperties {
		rowCount: number;
		columnCount: number;
		frozenRowCount: number;
		frozenColumnCount: number;
		hideGridlines: boolean;
		rowGroupControlAfter: boolean;
		columnGroupControlAfter: boolean;
	}

	interface GridRange
		extends Record<'sheetId' | 'startRowIndex' | 'endRowIndex' | 'startColumnIndex' | 'endColumnIndex', number> {}

	enum HorizontalAlign {
		HORIZONTAL_ALIGN_UNSPECIFIED,
		LEFT,
		CENTER,
		RIGHT,
	}

	enum HyperlinkDisplayType {
		HYPERLINK_DISPLAY_TYPE_UNSPECIFIED,
		LINKED,
		PLAIN_TEXT,
	}

	interface IterativeCalculationSettings {
		maxIterations: number;
		convergenceThreshold: number;
	}

	interface NumberFormat {
		type: NumberFormatType;
		pattern: string;
	}

	enum NumberFormatType {
		NUMBER_FORMAT_TYPE_UNSPECIFIED,
		TEXT,
		NUMBER,
		PERCENT,
		CURRENCY,
		DATE,
		TIME,
		DATE_TIME,
		SCIENTIFIC,
	}

	interface Padding extends Record<direction, number> {}

	enum RecalculationInterval {
		RECALCULATION_INTERVAL_UNSPECIFIED,
		ON_CHANGE,
		MINUTE,
		HOUR,
	}

	enum SheetType {
		SHEET_TYPE_UNSPECIFIED,
		GRID,
		OBJECT,
	}

	interface SpreadsheetTheme {
		primaryFontFamily: string;
		themeColors: ThemeColorPair[];
	}

	enum Style {
		STYLE_UNSPECIFIED,
		DOTTED,
		DASHED,
		SOLID,
		SOLID_MEDIUM,
		SOLID_THICK,
		NONE,
		DOUBLE,
	}

	enum TextDirection {
		TEXT_DIRECTION_UNSPECIFIED,
		LEFT_TO_RIGHT,
		RIGHT_TO_LEFT,
	}

	interface TextFormat {
		foregroundColor: Color;
		foregroundColorStyle: ColorStyle;
		fontFamily: string;
		fontSize: number;
		bold: boolean;
		italic: boolean;
		strikethrough: boolean;
		underline: boolean;
	}

	interface TextRotation {
		angle: number;
		vertical: boolean;
	}

	interface ThemeColorPair {
		colorType: ThemeColorType;
		color: ColorStyle;
	}

	enum ThemeColorType {
		THEME_COLOR_TYPE_UNSPECIFIED,
		TEXT,
		BACKGROUND,
		ACCENT1,
		ACCENT2,
		ACCENT3,
		ACCENT4,
		ACCENT5,
		ACCENT6,
		LINK,
	}

	enum VerticalAlign {
		VERTICAL_ALIGN_UNSPECIFIED,
		TOP,
		MIDDLE,
		BOTTOM,
	}

	enum WrapStrategy {
		WRAP_STRATEGY_UNSPECIFIED,
		OVERFLOW_CELL,
		LEGACY_WRAP,
		CLIP,
		WRAP,
	}
	//#endregion
	interface GoogleSpreadsheetBase {
		title?: string;
		locale?: string;
		timeZone?: string;
		autoRecalc?: RecalculationInterval;
		defaultFormat?: CellFormat;
		spreadsheetTheme?: SpreadsheetTheme;
		iterativeCalculationSettings?: IterativeCalculationSettings;
	}
	export class GoogleSpreadsheet implements GoogleSpreadsheetBase {
		// Basic Document Properties
		readonly spreadsheetId: string;
		readonly title: string;
		readonly locale: string;
		readonly timeZone: string;
		readonly autoRecalc: RecalculationInterval;
		readonly defaultFormat: CellFormat;
		readonly spreadsheetTheme: SpreadsheetTheme;
		readonly iterativeCalculationSettings: IterativeCalculationSettings;

		// Worksheets
		readonly sheetsById: Record<string, GoogleSpreadsheetWorksheet>;
		readonly sheetsByIndex: GoogleSpreadsheetWorksheet[];
		readonly sheetCount: number;

		constructor(spreadsheetId: string);

		// Authentication
		useServiceAccountAuth(creds: { client_email: string; private_key: string }): Promise<void>;
		useApiKey(key: string): Promise<void>;
		useRawAccessToken(key: string): Promise<void>;

		// Basic info
		loadInfo(): Promise<void>;
		updateProperties(props: GoogleSpreadsheetBase): Promise<void>;
		resetLocalCache(): void;

		// Managing Sheets
		addSheet(props?: {
			sheetId?: number;
			headerValues?: string[];
			props?: GoogleSpreadsheetWorksheetBase;
		}): Promise<GoogleSpreadsheetWorksheet>;
		deleteSheet(sheetId: string): Promise<void>;

		// Named Ranges
		addNamedRange(name: string, range: string | GridRange, rangeId?: string): Promise<any>;
		deleteNamedRange(rangeId: string): Promise<any>;

		// "Private" methods (not documented)
		private renewJwtAuth(): Promise<void>;
		private _setAxiosRequestAuth<T>(config: T): Promise<T>;
		private _handleAxiosResponse<T>(response: T): Promise<T>;
		private _handleAxiosErrors(error): Promise<void>;
		private _makeSingleUpdateRequest(requestType, requestParams): Promise<any>;
		private _makeBatchUpdateRequest(requests, responseRanges): Promise<void>;
		private _ensureInfoLoaded(): void;
		private _updateRawProperties(newProperties): void;
		private _updateOrCreateSheet({ properties, data }): void;
		private _getProp(param);
		private _setProp(param, newVal): never;
		private loadCells(filters): Promise<void>;
	}

	interface GoogleSpreadsheetWorksheetBase {
		title?: string;
		index?: number;
		gridProperties?: GridProperties;
		hidden?: boolean;
		tabColor?: Color;
		rightToLeft?: boolean;
	}
	export class GoogleSpreadsheetWorksheet implements GoogleSpreadsheetWorksheetBase {
		// Basic sheet properties
		readonly sheetId: string;
		readonly sheetType: SheetType;
		readonly title: string;
		readonly index: number;
		readonly gridProperties: GridProperties;
		readonly hidden: boolean;
		readonly tabColor: Color;
		readonly rightToLeft: boolean;

		// Sheet Dimensions & Stats
		readonly rowCount: number;
		readonly columnCount: number;
		readonly cellStats: {
			total: number;
			nonEmpty: number;
			loaded: number;
		};

		constructor(parentSpreadsheet: GoogleSpreadsheet, { properties, data });

		// Working With Rows
		loadHeaderRow(): Promise<void>;
		setHeaderRow(headerValues: string[]): Promise<void>;
		addRow(values: object): Promise<GoogleSpreadsheetRow>;
		getRows(options?: { offset?: number; limit?: number }): Promise<GoogleSpreadsheetRow>;

		// Working With Cells
		loadCells(filters?: any): Promise<any>;
		getCell(rowIndex: number, columnIndex: number): GoogleSpreadsheetCell;
		getCellByA1(a1Address: string): GoogleSpreadsheetCell;
		saveUpdatedCells(): Promise<void>;
		saveCells(cells: GoogleSpreadsheetCell[]): Promise<void>;
		resetLocalCache(dataOnly?: boolean): void;

		// Updating Sheet Properties
		updateProperties(props: GoogleSpreadsheetWorksheetBase): Promise<any>;
		resize(props: GoogleSpreadsheetWorksheetBase['gridProperties']): Promise<any>;
		updateGridProperties(props: GoogleSpreadsheetWorksheetBase['gridProperties']): Promise<any>;
		updateDimensionProperties(
			columnsOrRows: 'COLUMN' | 'ROW',
			props: DimensionProperties,
			bounds?: {
				startIndex?: number;
				endIndex?: number;
			},
		): Promise<any>;

		// Other
		clear(): Promise<void>;
		delete(): Promise<void>;
		del(): Promise<void>;
		copyToSpreadsheet(destinationSpreadsheetId: string): Promise<any>;

		// "Private" methods (undocumented)
		private _makeSingleUpdateRequest(requestType, requestParams): Promise<any>;
		private _ensureInfoLoaded(): void;
		private _fillCellData(dataRanges): void;
		private _getProp(param);
		private _setProp(param, newVal): never;
		private getCellsInRange(a1Range, options): Promise<any>;
		private updateNamedRange(): Promise<void>;
		private addNamedRange(): Promise<void>;
		private deleteNamedRange(): Promise<void>;
		private repeatCell(): Promise<void>;
		private autoFill(): Promise<void>;
		private cutPaste(): Promise<void>;
		private copyPaste(): Promise<void>;
		private mergeCells(): Promise<void>;
		private unmergeCells(): Promise<void>;
		private updateBorders(): Promise<void>;
		private addFilterView(): Promise<void>;
		private appendCells(): Promise<void>;
		private clearBasicFilter(): Promise<void>;
		private deleteDimension(): Promise<void>;
		private deleteEmbeddedObject(): Promise<void>;
		private deleteFilterView(): Promise<void>;
		private duplicateFilterView(): Promise<void>;
		private duplicateSheet(): Promise<void>;
		private findReplace(): Promise<void>;
		private insertDimension(): Promise<void>;
		private insertRange(): Promise<void>;
		private moveDimension(): Promise<void>;
		private updateEmbeddedObjectPosition(): Promise<void>;
		private pasteData(): Promise<void>;
		private textToColumns(): Promise<void>;
		private updateFilterView(): Promise<void>;
		private deleteRange(): Promise<void>;
		private appendDimension(): Promise<void>;
		private addConditionalFormatRule(): Promise<void>;
		private updateConditionalFormatRule(): Promise<void>;
		private deleteConditionalFormatRule(): Promise<void>;
		private sortRange(): Promise<void>;
		private setDataValidation(): Promise<void>;
		private setBasicFilter(): Promise<void>;
		private addProtectedRange(): Promise<void>;
		private updateProtectedRange(): Promise<void>;
		private deleteProtectedRange(): Promise<void>;
		private autoResizeDimensions(): Promise<void>;
		private addChart(): Promise<void>;
		private updateChartSpec(): Promise<void>;
		private updateBanding(): Promise<void>;
		private addBanding(): Promise<void>;
		private deleteBanding(): Promise<void>;
		private createDeveloperMetadata(): Promise<void>;
		private updateDeveloperMetadata(): Promise<void>;
		private deleteDeveloperMetadata(): Promise<void>;
		private randomizeRange(): Promise<void>;
		private addDimensionGroup(): Promise<void>;
		private deleteDimensionGroup(): Promise<void>;
		private updateDimensionGroup(): Promise<void>;
		private trimWhitespace(): Promise<void>;
		private deleteDuplicates(): Promise<void>;
		private addSlicer(): Promise<void>;
		private updateSlicerSpec(): Promise<void>;
	}

	export class GoogleSpreadsheetCell {
		// Cell Location
		readonly rowIndex: number;
		readonly columnIndex: number;
		readonly a1Row: number;
		readonly a1Column: string;
		readonly a1Address: string;

		// Cell Value(s)
		value: any;
		readonly valueType: string;
		readonly formattedValue: any;
		formula: string;
		readonly formulaError: Error;
		note: string;
		readonly hyperlink: string;

		// Cell Formatting
		readonly userEnteredFormat: CellFormat;
		readonly effectiveFormat: CellFormat;
		NumberFormat: NumberFormat;
		backgroundColor: Color;
		borders: Borders;
		padding: Padding;
		horizontalAlignment: HorizontalAlign;
		verticalAlignment: VerticalAlign;
		wrapStrategy: WrapStrategy;
		textDirection: TextDirection;
		textFormat: TextFormat;
		hyperlinkDisplayType: HyperlinkDisplayType;
		textRotation: TextRotation;

		constructor(parentSheet: GoogleSpreadsheetWorksheet, rowIndex: number, columnIndex: number, cellData?: object);

		// Methods
		clearAllFormatting(): void;
		discardUnsavedChanges(): void;
		save(): Promise<void>;

		// "Private" methods (undocumented)
		private _updateRawData(newData): void;
		private _getFormatParam(param);
		private _setFormatParam(param, newVal): void;
		private readonly _isDirty: boolean;
		private _getUpdateRequest(): object;
	}

	export class GoogleSpreadsheetRow implements Record<string, any> {
		readonly rowIndex: number;
		readonly a1Range: string;

		constructor(parentSheet: GoogleSpreadsheetWorksheet, rowNumber: number, data);

		save(): Promise<void>;
		delete(): Promise<any>;
		del(): Promise<any>;
	}

	export class GoogleSpreadsheetFormulaError {
		type: string;
		message: string;

		constructor(errorInfo: { type?: string; message?: string });
	}
}
