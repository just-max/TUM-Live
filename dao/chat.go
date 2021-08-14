package dao

import (
	"TUM-Live/model"
	"gorm.io/gorm/clause"
)

func AddMessage(chat model.Chat) {
	DB.Save(&chat)
}

//GetMessagesForStream returns all messages for a stream
func GetMessagesForStream(streamID uint) (messages []model.Chat, err error) {
	err = DB.Preload(clause.Associations).Find(&messages, "stream_id = ? AND reply_to IS NULL", streamID).Error
	return
}

//IsUserCooledDown returns true if a user sent 5 messages within the last two minutes
func IsUserCooledDown(uid string) bool {
	var chat []model.Chat
	res := DB.Table("chats").Where("user_id = ? AND created_at > ADDTIME(NOW(), '-0:02:0')", uid).Scan(&chat)
	return res.RowsAffected >= 5
}
