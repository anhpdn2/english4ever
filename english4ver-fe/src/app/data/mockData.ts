export interface Vocabulary {
  id: string;
  english: string;
  vietnamese: string;
  imageUrl: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  vocabularies: Vocabulary[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  color: string;
  units: Unit[];
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Tiếng Anh Giao Tiếp",
    description: "Học từ vựng và cụm từ giao tiếp hàng ngày",
    color: "bg-blue-500",
    units: [
      {
        id: "1-1",
        title: "Chào hỏi & Giới thiệu",
        description: "Các từ vựng cơ bản về chào hỏi",
        vocabularies: [
          {
            id: "v1",
            english: "Hello",
            vietnamese: "Xin chào",
            imageUrl: "hello greeting wave"
          },
          {
            id: "v2",
            english: "Goodbye",
            vietnamese: "Tạm biệt",
            imageUrl: "goodbye wave farewell"
          },
          {
            id: "v3",
            english: "Thank you",
            vietnamese: "Cảm ơn",
            imageUrl: "thank you gratitude hands"
          },
          {
            id: "v4",
            english: "Please",
            vietnamese: "Làm ơn",
            imageUrl: "please polite request"
          },
          {
            id: "v5",
            english: "Sorry",
            vietnamese: "Xin lỗi",
            imageUrl: "sorry apology sad"
          }
        ]
      },
      {
        id: "1-2",
        title: "Gia đình",
        description: "Từ vựng về các thành viên trong gia đình",
        vocabularies: [
          {
            id: "v6",
            english: "Mother",
            vietnamese: "Mẹ",
            imageUrl: "mother mom parent woman"
          },
          {
            id: "v7",
            english: "Father",
            vietnamese: "Bố",
            imageUrl: "father dad parent man"
          },
          {
            id: "v8",
            english: "Sister",
            vietnamese: "Chị/Em gái",
            imageUrl: "sister sibling girl"
          },
          {
            id: "v9",
            english: "Brother",
            vietnamese: "Anh/Em trai",
            imageUrl: "brother sibling boy"
          },
          {
            id: "v10",
            english: "Family",
            vietnamese: "Gia đình",
            imageUrl: "family together happy"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Tiếng Anh Thương Mại",
    description: "Từ vựng chuyên ngành kinh doanh",
    color: "bg-green-500",
    units: [
      {
        id: "2-1",
        title: "Văn phòng",
        description: "Từ vựng liên quan đến văn phòng làm việc",
        vocabularies: [
          {
            id: "v11",
            english: "Computer",
            vietnamese: "Máy tính",
            imageUrl: "computer laptop desktop"
          },
          {
            id: "v12",
            english: "Desk",
            vietnamese: "Bàn làm việc",
            imageUrl: "desk office table"
          },
          {
            id: "v13",
            english: "Chair",
            vietnamese: "Ghế",
            imageUrl: "office chair seat"
          },
          {
            id: "v14",
            english: "Meeting",
            vietnamese: "Cuộc họp",
            imageUrl: "business meeting discussion"
          },
          {
            id: "v15",
            english: "Report",
            vietnamese: "Báo cáo",
            imageUrl: "business report document"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Tiếng Anh Du Lịch",
    description: "Từ vựng hữu ích khi đi du lịch",
    color: "bg-purple-500",
    units: [
      {
        id: "3-1",
        title: "Khách sạn",
        description: "Từ vựng liên quan đến khách sạn",
        vocabularies: [
          {
            id: "v16",
            english: "Hotel",
            vietnamese: "Khách sạn",
            imageUrl: "hotel building resort"
          },
          {
            id: "v17",
            english: "Room",
            vietnamese: "Phòng",
            imageUrl: "hotel room bedroom"
          },
          {
            id: "v18",
            english: "Reservation",
            vietnamese: "Đặt trước",
            imageUrl: "reservation booking calendar"
          },
          {
            id: "v19",
            english: "Luggage",
            vietnamese: "Hành lý",
            imageUrl: "luggage suitcase travel"
          },
          {
            id: "v20",
            english: "Reception",
            vietnamese: "Lễ tân",
            imageUrl: "hotel reception desk"
          }
        ]
      }
    ]
  }
];
