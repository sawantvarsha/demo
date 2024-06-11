export interface Customersetupformdata {
  sequenceNumber?: number;
  tagName?: string;
  sectionName?: string;
  controlName: string;
  controlType: string;
  valueType?: string;
  currentValue?: string;
  placeholder?: string;
  options?: Array<{
    optionName: string;
    value: string;
  }>;
  validators?: {
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    disabled?: boolean;
    visibility?: string;
    spacesAllowed?: boolean;
    mandatory?: boolean;
    IsBold?: boolean;
    FontSize?: string;
  };
  selectedValue?: string;
  selectedValueArray?: Array<{}>;
  ShowMultiSelectPopup?: boolean;
  pageNumber: string;
  DocUploadValue?: boolean;
  docUploadValuelabel?: string;
  IsHorizontal?: boolean;
  sectionwiseSequenceNo?: number;
  Misc1?:string;
}
