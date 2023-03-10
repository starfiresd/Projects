USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Insert]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:00:00>
-- Description: Messages Insert
-- Code Reviewer: Mariana Hernandez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Insert]
		@Message nvarchar(1000)
		,@Subject nvarchar(100)
		,@RecipientId int
		,@SenderId int
		,@Id int OUTPUT

/*---Test Code---

	DECLARE	@Message nvarchar(1000) = 'Test message from SQL proc for review'
		,@Subject nvarchar(100) = 'Test message'
		,@RecipientId int = 3
		,@SenderId int = 10
		,@Id int = 0

	EXECUTE [dbo].[Messages_Insert]
		@Message
		,@Subject
		,@RecipientId
		,@SenderId
		,@Id OUTPUT
	
	SELECT*
	FROM [dbo].[Messages]
	ORDER BY Id

*/

AS

BEGIN

	INSERT INTO [dbo].[Messages]
		([Message]
		,[Subject]
		,[RecipientId]
		,[SenderId]
		,[DateCreated]
		,[DateModified])
	VALUES
		(@Message
		,@Subject
		,@RecipientId
		,@SenderId
		,GETUTCDATE()
		,GETUTCDATE())

	SET @Id = SCOPE_IDENTITY()

END
GO
