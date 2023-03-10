USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Select_ByCreatedBy_Paginated]    Script Date: 03/07/23 13:57:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================
-- Author: <Christopher Doupis>
-- Create date: <01-11-2023T16:15:00>
-- Description: Appointments SelectByAttorneyId
-- Code Reviewer: 

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Appointments_Select_ByCreatedBy_Paginated]
		@CreatedById int
		,@PageIndex int
		,@PageSize int

/*---TEST CODE---

DECLARE @CreatedById int = 130
		,@PageIndex int = 0
		,@PageSize int = 5

EXECUTE [dbo].[Appointments_Select_ByCreatedBy_Paginated]
		@CreatedById
		,@PageIndex
		,@PageSize

SELECT *
FROM [dbo].[Users]
WHERE Id = 130

SELECT *
FROM [dbo].[Appointments]

SELECT *
FROM [dbo].[AttorneyProfiles]

*/

AS

BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT a.Id
		,at.Id AS AppointmentTypeId
		,at.Name AS AppointmentType
		,u.Id AS UserId
		,u.FirstName
		,u.Mi AS MiddleInitial
		,u.LastName
		,u.AvatarUrl
		,u.Email AS ClientEmail
		,su.Id AS UserStatusId
		,su.Name AS UserStatus
		,Role = (
					SELECT	r.Id AS id
							,r.Name AS name
					FROM [dbo].[Roles] AS r inner join [dbo].[UserRoles] AS ur
							ON r.Id = ur.RoleId
					WHERE u.Id = ur.UserId
					FOR JSON AUTO
				)
		,ap.Id AS AttorneyId
		,ap.PracticeName
		,l.Id AS LocationId
		,lt.Id AS LocationTypeId
		,lt.Name LocationTypeName
		,l.LineOne
		,l.LineTwo
		,l.City
		,l.Zip
		,st.Id AS StateId
		,st.Name AS State
		,l.Latitude
		,l.Longitude
		,l.DateCreated AS LocationDateCreated
		,l.DateModified AS LocationDateModified
		,l.CreatedBy AS LocationCreatedBy
		,l.ModifiedBy AS LocationModifiedBy
		,ap.Bio
		,ap.Phone
		,ap.Email AS AttorneyEmail
		,ap.Website
		,Languages = (
					SELECT  lang.Id AS id
							,lang.Code AS code
							,lang.Name AS name
					FROM [dbo].[AttorneyLanguages] as atl inner join dbo.Languages as lang
							ON atl.LanguageId = lang.Id
					WHERE atl.AttorneyProfileId = ap.Id
					FOR JSON AUTO
						)
		,ap.DateCreated as AttorneyDateCreated
		,ap.DateModified as AttorneyDateModified
		,a.Notes
		,a.IsConfirmed
		,a.AppointmentStart
		,a.AppointmentEnd
		,s.Id as AppointmentStatusId
		,s.Name AS AppointmentStatus
		,a.DateCreated
		,a.DateModified
		,uc.Id AS CreatedByUserId
		,uc.FirstName as CreatedByFirstName
		,uc.Mi AS CreateByMiddleInitial
		,uc.LastName AS CreatedByLastName
		,uc.AvatarUrl AS CreatedByAvatarUrl
		,uc.Email AS CreatedByClientEmail
		,sucb.Id AS CreatedByUserStatusId
		,sucb.Name AS CreatedByUserStatus
		,CreatedByRole = (
					SELECT	r.Id AS id
							,r.Name AS name
					FROM [dbo].[Roles] AS r inner join [dbo].[UserRoles] AS ur
							ON r.Id = ur.RoleId
					WHERE uc.Id = ur.UserId
					FOR JSON AUTO
				)
		,um.Id AS ModifiedByUserId
		,um.FirstName as ModifiedByFirstName
		,um.Mi AS ModifiedByMiddleInitial
		,um.LastName AS ModifiedByLastName
		,um.AvatarUrl AS ModifiedByAvatarUrl
		,um.Email AS ModifiedByClientEmail
		,sumb.Id AS ModifiedByUserStatusId
		,sumb.Name AS ModifiedByUserStatus
		,ModifiedByRole = (
					SELECT	r.Id AS id
							,r.Name AS name
					FROM [dbo].[Roles] AS r inner join [dbo].[UserRoles] AS ur
							ON r.Id = ur.RoleId
					WHERE uc.Id = ur.UserId
					FOR JSON AUTO
						)
		,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Appointments] as a inner join [dbo].[AppointmentTypes] as at
										ON a.AppointmentTypeId = at.Id
								   inner join [dbo].[Users] AS u
										ON a.ClientId =  u.Id
								   inner join [dbo].[StatusTypes] AS su
										ON u.StatusId = su.Id
								   inner join [dbo].[AttorneyProfiles] AS ap
										ON a.AttorneyProfileId = ap.Id
								   inner join [dbo].Locations AS l
										ON ap.LocationId = l.Id
								   inner join [dbo].[LocationTypes] AS lt
										ON l.LocationTypeId = lt.Id
								   inner join [dbo].[States] AS st
										ON l.StateId = st.Id
								   inner join [dbo].StatusTypes AS s
										ON a.StatusTypesId = s.Id
								   inner join [dbo].[Users] AS uc
										ON a.CreatedBy =  uc.Id
								   inner join [dbo].[StatusTypes] AS sucb
										ON uc.StatusId = sucb.Id
								   inner join [dbo].[Users] AS um
										ON a.ModifiedBy =  um.Id
								   inner join [dbo].[StatusTypes] AS sumb
										ON uc.StatusId = sumb.Id

	WHERE ap.CreatedBy = @CreatedById
		AND a.StatusTypesId = 1
	ORDER BY a.AppointmentStart

	OFFSET @offset Rows
	FETCH NEXT @PageSize Rows ONLY

END
GO
