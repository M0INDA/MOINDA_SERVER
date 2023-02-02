// import { ValueTransformer } from 'typeorm';
// import { LocalDate } from 'js-joda';

// export class LocalDateTimeTransformer implements ValueTransformer {
//   to(entityValue: LocalDateTime): Date {
//     return DateTimeUtil.toDate(entityValue);
//   }

//   from(databaseValue: Date): LocalDateTime {
//     return DateTimeUtil.toLocalDateTime(databaseValue);
//   }
// }

// export class LocalDateTransformer implements ValueTransformer {
//   // entity -> db로 넣을때
//   to(entityValue: LocalDate): Date {
//     return DateTimeUtil.toDate(entityValue);
//   }

//   // db -> entity로 가져올때
//   from(databaseValue: Date): LocalDate {
//     return DateTimeUtil.toLocalDate(databaseValue);
//   }
// }
