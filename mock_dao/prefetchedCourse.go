// Code generated by MockGen. DO NOT EDIT.
// Source: prefetchedCourse.go

// Package mock_dao is a generated GoMock package.
package mock_dao

import (
	context "context"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	model "github.com/joschahenningsen/TUM-Live/model"
)

// MockPrefetchedCourseDao is a mock of PrefetchedCourseDao interface.
type MockPrefetchedCourseDao struct {
	ctrl     *gomock.Controller
	recorder *MockPrefetchedCourseDaoMockRecorder
}

// MockPrefetchedCourseDaoMockRecorder is the mock recorder for MockPrefetchedCourseDao.
type MockPrefetchedCourseDaoMockRecorder struct {
	mock *MockPrefetchedCourseDao
}

// NewMockPrefetchedCourseDao creates a new mock instance.
func NewMockPrefetchedCourseDao(ctrl *gomock.Controller) *MockPrefetchedCourseDao {
	mock := &MockPrefetchedCourseDao{ctrl: ctrl}
	mock.recorder = &MockPrefetchedCourseDaoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockPrefetchedCourseDao) EXPECT() *MockPrefetchedCourseDaoMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockPrefetchedCourseDao) Create(arg0 context.Context, arg1 *model.PrefetchedCourse) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockPrefetchedCourseDaoMockRecorder) Create(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockPrefetchedCourseDao)(nil).Create), arg0, arg1)
}

// Delete mocks base method.
func (m *MockPrefetchedCourseDao) Delete(arg0 context.Context, arg1 uint) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Delete", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// Delete indicates an expected call of Delete.
func (mr *MockPrefetchedCourseDaoMockRecorder) Delete(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Delete", reflect.TypeOf((*MockPrefetchedCourseDao)(nil).Delete), arg0, arg1)
}

// Get mocks base method.
func (m *MockPrefetchedCourseDao) Get(arg0 context.Context, arg1 uint) (model.PrefetchedCourse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Get", arg0, arg1)
	ret0, _ := ret[0].(model.PrefetchedCourse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Get indicates an expected call of Get.
func (mr *MockPrefetchedCourseDaoMockRecorder) Get(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Get", reflect.TypeOf((*MockPrefetchedCourseDao)(nil).Get), arg0, arg1)
}
