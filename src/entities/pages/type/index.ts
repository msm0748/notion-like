export interface PageDto {
  id: string;
  title: string;
  content: object | null;
  isShared: boolean;
  isTrashed: boolean;
  userId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  /** 하위 페이지 목록 (단건 조회 시 children=true 일 때만) */
  children?: PageDto[];
  /** 현재 사용자 기준 즐겨찾기 여부 (단건 조회 시 포함) */
  isFavorite?: boolean;
}
