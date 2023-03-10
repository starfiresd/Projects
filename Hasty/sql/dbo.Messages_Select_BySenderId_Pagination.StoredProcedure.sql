USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_BySenderId_Pagination]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T22:10:00>
-- Description: Messages Select BySenderId Pagination
-- Code Reviewer: Mariana Hernandez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Select_BySenderId_Pagination]
		@SenderId int
		,@PageIndex int
		,@PageSize int

/*---Test Code---

	DECLARE @SenderId int = 10
		,@PageIndex int = 0
		,@PageSize int = 5

	EXECUTE [dbo].[Messages_Select_BySenderId_Pagination]
		@SenderId
		,@PageIndex
		,@PageSize

*/

AS

BEGIN

	DECLARE @Offset int = @PageIndex * @PageSize
	
	SELECT m.Id
		,m.Message
		,m.Subject
		,m.RecipientId
		,m.SenderId
		,m.DateSent
		,m.DateRead
		,m.DateModified
		,m.DateCreated
		,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Messages] as m
	WHERE m.SenderId = @SenderId
	ORDER BY m.Id

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
GO
